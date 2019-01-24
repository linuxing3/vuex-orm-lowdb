import Action from "./Action";
import Context from "../common/context";

export default class Persist extends Action {
  /**
   * Is called when an item is inserted or updated in the store
   *
   * @param {object} store
   * @param {object} payload
   */
  static async iterateCall(
    { state, dispatch },
    payload,
    action = "insertOrUpdate",
  ) {
    return dispatch(action, payload).then(result => {
      // FIXME persisting logic
      const promises = [];
      const context = Context.getInstance();

      Object.keys(result).forEach(entity => {
        result[entity].forEach(record => {
          const model = context.getModelByEntity(entity);
          promises.push(
            new Promise((resolve, reject) => {
              model.$localStore
                .read()
                .get(entity)
                .push(record)
                .write();
              resolve(record);
            }),
          );
        });
      });

      return Promise.all(promises).then(() => result);
    });
  }

  static create(context, payload) {
    return this.call(context, payload);
  }

  static update(context, payload) {
    return this.call(context, payload, "update");
  }

  /**
   * Is called when an item is inserted or updated in the store
   *
   * @param {object} store
   * @param {object} payload
   */
  static async call({ state, dispatch }, payload, action = "insertOrUpdate") {
    console.log(payload);

    return dispatch(action, payload).then(result => {
      const context = Context.getInstance();
      const model = context.getModelFromState(state);
      const entity = model.entity.toLowerCase();
      const record = result[entity][0];
      console.log(entity);
      console.log(record);

      if (action === "update") {
        model.$localStore
          .read()
          .get(entity)
          .find({ _id: record._id })
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
