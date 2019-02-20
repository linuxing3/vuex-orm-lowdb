import Action from "./Action";
import Context from "../common/context";

export default class Persist extends Action {

  /**
   * Is called when an item is inserted or updated in the store
   *
   * @param {object} store
   * @param {object} payload
   * @param {string} action
   */
  static async call({ state, dispatch }, payload, action = "insertOrUpdate") {
    console.log(payload);

    return dispatch(action, payload).then(result => {
      const context = Context.getInstance();
      const model = context.getModelFromState(state);

      const entity = model.entity.toLowerCase();
      console.log(entity);

      const record = result[entity][0]; // should equal to payload
      console.log(record);

      const query = { _id: id } || { id: id };

      if (action === "update") {
        model.$localStore
          .read()
          .get(entity)
          .find(query)
          .assign(record)
          .write();
      } else {
        model.$localStore
          .read()
          .get(entity)
          .push(record)
          .write();
      }
    });
  }
}
