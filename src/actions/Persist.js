import Action from './Action';
import Model from '../orm/Model';
import Context from '../common/context';

export default class Persist extends Action {
  /**
   * Is called when an item is inserted or updated in the store
   *
   * @param {object} store
   * @param {object} payload
   */
  static async call({ dispatch }, payload, action = 'insertOrUpdate') {
    return dispatch(action, payload).then((result) => {
      const promises = [];
      const context = Context.getInstance();

      Object.keys(result).forEach((entity) => {
        result[entity].forEach((record) => {
          const model = context.getModelByEntity(entity);
          const storeName = model.entity.toLowerCase();
          const key = this.getRecordKey(record);
          const data = Model.getPersistableFields(model).reduce((entry, field) => {
            entry[field] = record[field];
            return entry;
          }, {});

          /**
           * 
           * @example
           * promises.push(model.$localStore.setItem(key, data));
          */
          const promise = new Promise((resolves, rejects) => {
            try {
              model.$localStore[storeName]
                .read()
                .get(storeName)
                .push(data)
                .write();
              resolves(true)
            } catch (error) {
              rejects(error);
            }
          })
          promises.push(promise);
        });
      });

      return Promise.all(promises).then(() => result);
    });
  }

  static create(context, payload) {
    return this.call(context, payload);
  }

  static update(context, payload) {
    return this.call(context, payload, 'update');
  }
}
