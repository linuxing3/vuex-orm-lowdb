import Vue from "vue";
import Vuex from "vuex";
import VuexORM, { Database, Model } from "@vuex-orm/core";
import VuexORMLowdbPlugin from "../src";

import Action from "../src/actions/Action";
import Context from "../src/common/context";


Vue.use(Vuex);

class User extends Model {
  static entity = "users";
}

class Post extends Model {
  static entity = "posts";
  static primaryKey = "customId";
}

const users = {
  state: {},
  actions: {},
};

const posts = {
  state() { },
  mutations: {},
};

const entities = [
  { name: "users", model: User, module: users },
  { name: "posts", model: Post, module: posts },
];


let { store, instance, database } = createStore(entities); 

const context = Context.getInstance();

describe("Unit – Database", () => {

  it("can create vuex store with lowdb plugin", () => {

    expect(store.plugins).not.toBeUndefined;
    expect(instance).toEqual(VuexORMLowdb.instance);

  });

  it("can do actions", () => {

    let model = context.getModelByEntity(entities[0]);

    expect(model).toBeInstanceOf(User);

  });
});


/**
 * Create a new Vuex Store.
 */
function createStore(entities, namespace = "entities") {
  const database = new Database();

  VuexORM.use(VuexORMLowdbPlugin, { database });

  entities.forEach(entity => {
    database.register(entity.model, entity.module || {});
  });

  const store = new Vuex.Store({
    plugins: [VuexORM.install(database, { namespace })],
    strict: true,
  });

  return { store, instance: VuexORMLowdbPlugin.instance, database };
}
