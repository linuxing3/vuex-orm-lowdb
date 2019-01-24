import Context from '../common/context';

export default class Model {
  /**
   * Tells if a field is a attribute (and thus not a relation)
   * @param {Field} field
   * @returns {boolean}
   */
  static isFieldAttribute(field) {
    const context = Context.getInstance();

    return field instanceof context.components.Increment
      || field instanceof context.components.Attr
      || field instanceof context.components.String
      || field instanceof context.components.Number
      || field instanceof context.components.Boolean;
  }

  /**
   * return fields which are attribute
   * @param {model} model 
   */
  static getPersistableFields(model) {
    const fields = model.getFields();

    return Object.keys(fields).filter(key => Model.isFieldAttribute(fields[key]));
  }

  /**
   * return fields which are relation
   * @param {model} model 
   */
  static getUnPersistableFields(model) {
    const fields = model.getFields();

    return Object.keys(fields).filter(key => !Model.isFieldAttribute(fields[key]));
  }
}
