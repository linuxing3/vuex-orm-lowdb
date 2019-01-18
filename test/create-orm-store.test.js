import Vue from "vue";
import Vuex from "vuex";
import VuexORM, { Database, Model } from "@vuex-orm/core";
import VuexORMLowdb from "../src";

Vue.use(Vuex);

/**
 * Create a new Vuex Store.
 */
function createStore(entities, namespace = "entities") {
  const database = new Database();

  VuexORM.use(VuexORMLowdb, {
    database
  });

  entities.forEach(entity => {
    database.register(entity.model, entity.module || {});
  });

  return new Vuex.Store({
    plugins: [VuexORM.install(database, { namespace })],
    strict: true,
  });
}

describe("Unit – Database", () => {
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

  it("can register models", () => {
    // const database = createStore(["user", "posts"], "entities");
    const database = new Database();

    const expected = [
      { name: "users", model: User, module: users },
      { name: "posts", model: Post, module: posts },
    ];

    database.register(User, users);
    database.register(Post, posts);

    expect(database.entities).toEqual(expected);
  });

  it("can create vuex store with lowdb plugin", () => {
    const entities = [
      { name: "users", model: User, module: users },
      { name: "posts", model: Post, module: posts },
    ];

    const store = createStore(entities);

    expect(store.plugins).not.toBeUndefined;
  });
});
