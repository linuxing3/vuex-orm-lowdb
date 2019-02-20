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

    const id =  typeof params === "object" ? payload._id || payload.id : payload;

    return dispatch("delete", { where: id }).then(result => {
      console.log(result);

      const context = Context.getInstance();
      const model = context.getModelFromState(state);
      const entity = model.entity.toLowerCase();
      console.log(entity);

      const query = { _id: id } || { id: id };

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
