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

    let { dbPath } = Context.getInstance().options;
    let storePath = resolve(dbPath) || "~/";
    storePath = join(storePath, storeName);

    // 添加每个数据文件
    model.$localStore = Datastore(
      new FileSync(storePath) || new Memory(storePath),
    );

    // 初始化每个数据文件的数据
    model.$localStore.set(storeName, []).write();

    // model.$localStore._.mixin(LodashId);

    return model;
  }

  static getRecordKey(record) {
    return typeof record.$id === 'string' ? record.$id : String(record.$id);
  }
}
