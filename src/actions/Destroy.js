import Action from './Action';
import Context from '../common/context';

export default class Destroy extends Action {
  /**
   * Is Called after new model deletion from the store
   *
   * @param {object} record
   * @param {string} entityName
   */
  static async call({ state, dispatch }, payload) {
    return dispatch('delete', payload).then((result) => {
      const context = Context.getInstance();
      const records = Array.isArray(result) ? result : [result];
      const model = context.getModelFromState(state);
      const storeName = model.entity.toLowerCase();
      // 遍历每个记录，返回一个Promise，用于后续处理
      // @example
      // return model.$localStore.removeItem(key);
      const promises = records.map((record) => {
        const key = this.getRecordKey(record);
        const promise = new Promise((resolves, rejects) => {
          try {            
            model.$localStore[storeName]
              .read()
              .get(storeName)
              .remove({ $id: key })
              .write();
            resolves(true)
          } catch (error) {
            rejects(error);
          }
        })
        return promise;
      });

      return Promise.all(promises).then(() => result);
    });
  }
}
