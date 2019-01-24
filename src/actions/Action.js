import { resolve, join } from "path";
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

    let storeName = model.entity.toLowerCase();

    let dbPath = Context.getInstance().options.dbPath;
    let storePath = resolve(dbPath);
    storePath = join(storePath, storeName);

    // 添加数据文件
    model.$localStore = Datastore(
      new FileSync(storePath) || new Memory(storePath),
    );

    // 初始化数据文件的数据
    if (!model.$localStore.has(storeName).value()) {
      model.$localStore.set(storeName, []).write();
    } else {
      console.log(`${storeName} default value exists`);
    }

    // model.$localStore._.mixin(LodashId);

    return model;
  }

  static getRecordKey(record) {
    return typeof record.$id === 'string' ? record.$id : String(record.$id);
  }
}
