import Action from './Action';
import Context from '../common/context';

export default class Get extends Action {
  /**
   * Call $fetch method
   * @param {object} store
   * @param {object} params
   */
  static async call({ state, dispatch }, params) {
    const context = Context.getInstance();
    const model = context.getModelFromState(state);
    const entity = model.entity.toLowerCase();

    const id = typeof params === 'object' ? params.id : params;

    const query = { _id: id } || { id };

    if (id) {
      const records = model.$localStore
        .read()
        .get(entity)
        .find(query)
        .value();
      return dispatch('insertOrUpdate', {
        data: records,
      });
    }
    return null;
  }
}
