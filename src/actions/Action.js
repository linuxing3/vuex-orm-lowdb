// import localforage from 'localforage';

import Datastore from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import Memory from 'lowdb/adapters/Memory';
// import LodashId from 'lodash-id';

import _ from 'lodash';

import Context from '../common/context';

export default class Action {
  /**
   * Transform Model to include ModelConfig
   * @param {object} model
   */
  static transformModel(model) {
    const context = Context.getInstance();

    /**
     * Add user common fields
     */
    model.getFields = () => {
      if (!model.cachedFields) {
        const _commonFields = context.options.commonFields;
        const commonFields = {};

        if (_commonFields) {
          Object.keys(_commonFields).forEach((fieldName) => {
            const fieldOptions = _commonFields[fieldName];
            let type = 'attr';
            let defaultValue = null;

            if (typeof fieldOptions === 'string') {
              defaultValue = fieldOptions;
            } else {
              type = fieldOptions.type || type;
              defaultValue = fieldOptions.default;
            }

            commonFields[fieldName] = model[type](defaultValue);
          });
        }

        model.cachedFields = _.merge({}, commonFields, model.fields());
      }

      return model.cachedFields;
    };

    const oldIdFn = model.id;

    model.id = (record) => {
      const keys = Array.isArray(model.primaryKey) ? model.primaryKey : [model.primaryKey];

      keys.forEach((key) => {
        if (!record[key]) {
          record[key] = context.options.generateId(record);
        }
      });

      return oldIdFn.call(model, record);
    };

    const option = {
      name: Context.getInstance().options.name || 'vuex', // default is `vuex`
      storeName: model.entity.toLowerCase() || 'data', // default is `data`
    };

    // 存储池
    // 索引方式: { data: { data: { data: [] } } }
    model.$localStore = {};

    // 添加每个数据文件
    model.$localStore[option.storeName] = Datastore(
      new FileSync(option.storeName) || new Memory(option.storeName),
    );

    // 初始化每个数据文件的数据
    _.keys(model.$localStore).map((key) => {
      const db = model.$localStore[key];
      db.set(option.storeName, []).write();
    });

    // model.$localStore._.mixin(LodashId);

    return model;
  }

  static getRecordKey(record) {
    return typeof record.$id === 'string' ? record.$id : String(record.$id);
  }
}
