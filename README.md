[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License](https://img.shields.io/npm/l/vuex-orm-lowdb.svg)](https://github.com/linuxing3/vuex-orm-lowdb/blob/master/LICENSE.md)

# Vuex ORM Plugin: Lowdb

VuexOrmLowdb is a plugin for the amazing [VuexORM](https://github.com/vuex-orm/vuex-orm) that let you sync your [Vuex](https://github.com/vuejs/vuex) Store with Lowdb

## Installation

Add the package to your dependencies

```shell
yarn add vuex-orm-lowdb
```
Or

```shell
npm install --save vuex-orm-lowdb
```

Then you can setup the plugin

``` js
import VuexORM from '@vuex-orm/core'
import VuexOrmLowdb from 'vuex-orm-lowdb'

const database = new VuexORM.Database()

VuexORM.use(VuexOrmLowdb, {
  database,
  dbPath: "/public/data"
})

// ...

export default () => new Vuex.Store({
  namespaced: true,
  plugins: [VuexORM.install(database)]
})

```

See https://vuex-orm.github.io/vuex-orm/guide/prologue/getting-started.html#create-modules on how to setup the database

## Actions

This plugin add some vuex actions to load and persist data in an IndexedDB

| Action  | Description |
| ------- | ----------- |
| $fetch  | Load data from the lowdb store associated to a model and persist them in the Vuex Store |
| $create | Like VuexORM `insert`, but also persist data to lowdb |
| $update | Like VuexORM `update`, but also persist changes to lowdb |
| $delete | Like VuexORM `delete`, but also remove data from lowdb |

### Example Usage

```vue
<template>
  <div>
    <input type="text" v-model="todo">
    <input type="button" @click="addTodo">
    
    <ul>
      <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
    </ul>
  </div>
</template>

<script>
  import Todo from './store/models/Todo'
  
  export default {
    data () {
      return {
        todo: ''
      }
    },
    computed: {
      todos () {
        return Todo.query().all()
      }
    },
    async mounted () {
      await Todo.$fetch()
    },
    methods: {
      addTodo () {
        if (this.todo) {
          Todo.$create({
            title: this.todo
          })
        }
      },
      deleteTodo() {
        Todo.$delete({
          id: 1,
          title: this.todo
        })
      },
      updateTodo() {
        Todo.$update({
          id: 1,
          title: this.todo
        })
      },
    }
  }
</script>
```
