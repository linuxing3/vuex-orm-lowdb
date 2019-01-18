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

    // FIXME persisting logic

    return dispatch('delete', payload).then((result) => {
      const context = Context.getInstance();
      const entity = context.entity;

      const records = Array.isArray(result) ? result : [result];

      const model = context.getModelFromState(state);

      records.forEach(record => {
        try {
          model.$localStore
            .read()
            .get(entity)
            .remove({ $id: record.$id })
            .write();
          resolves(true);
        } catch (error) {
          rejects(error);
        }
      })
    });
  }
}
