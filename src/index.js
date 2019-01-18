import VuexOrmLowdb from './vuex-orm-lowdb';

export default class VuexOrmLowdbPlugin {
  /**
   * This is called, when VuexORM.install(VuexOrmLowdb, options) is called.
   *
   * @param {Components} components The Vuex-ORM Components collection
   * @param {Options} options The options passed to VuexORM.install
   * @returns {VuexOrmLowdb}
   */

  static install(components, options) {
    VuexOrmLowdbPlugin.instance = new VuexOrmLowdb(components, options);
    return VuexOrmLowdbPlugin.instance;
  }
}
