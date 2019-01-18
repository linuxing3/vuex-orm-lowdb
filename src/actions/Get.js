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
    const storeName = model.entity.toLowerCase();
    const id = typeof params === 'object' ? params.id : params;

    if (id) {
      let records = model.$localStore[storeName]
        .read()
        .get(storeName)
        .find({ $id: id })
        .value();
      return dispatch('insertOrUpdate', {
          data: records,
        });
      } else {
      return null;
    }
  }
}
