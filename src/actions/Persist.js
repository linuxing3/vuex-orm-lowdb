import Action from './Action';
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
      // FIXME persisting logic
      
      const context = Context.getInstance();
      const entity = context.entity;
      const model = context.getModelByEntity(entity);
      
      const records = Array.isArray(result) ? result : [result];

      records.forEach(record => {
        try {
          model.$localStore
            .read()
            .get(entity)
            .push(record)
            .write();
          resolves(record);
        } catch (error) {
          rejects(error);
        }
      });
    })
  }

  static create(context, payload) {
    return this.call(context, payload);
  }

  static update(context, payload) {
    return this.call(context, payload, 'update');
  }
}
