import Action from './Action';
import Context from '../common/context';

export default class Fetch extends Action {
  /**
   * Call $fetch method
   * @param {object} store
   * @param {object} params
   */
  static async call({ state, dispatch }) {
    const context = Context.getInstance();
    const model = context.getModelFromState(state);
    const storeName = model.entity.toLowerCase();

    let records = model.$localStore[storeName]
      .read()
      .get(storeName)
      .value();

    return dispatch('insertOrUpdate', {
      data: records,
    });
  }
}
