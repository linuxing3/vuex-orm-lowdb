import Action from "./Action";
import Context from "../common/context";

export default class Destroy extends Action {
  /**
   * Is Called after new model deletion from the store
   *
   * @param {object} record
   * @param {string} entityName
   */
  static async call({ state, dispatch }, payload) {
    console.log(payload);

    return dispatch("delete", payload._id || payload.$id).then(result => {
      const context = Context.getInstance();

      const model = context.getModelFromState(state);
      const entity = model.entity.toLowerCase();
      console.log(entity);
      const query = { $id: payload.$id } || { _id: payload._id };
      try {
        model.$localStore
          .read()
          .get(entity)
          .remove(query)
          .write();
      } catch (error) {
        console.log(error);
      }
    });
  }
}
