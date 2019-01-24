import Action from "./Action";
import Context from "../common/context";
import { keyBy } from "lodash";

export default class Fetch extends Action {
  /**
   * Call $fetch method
   * @param {object} store
   * @param {object} params
   */
  static async call({ state, dispatch }) {
    const context = Context.getInstance();
    const model = context.getModelFromState(state);
    const entity = model.entity.toLowerCase();

    const records = model.$localStore
      .read()
      .get(entity)
      .value();

    let newRecords = keyBy(records, o => o["_id"]);

    return dispatch("insertOrUpdate", {
      data: newRecords,
    });
  }
}
