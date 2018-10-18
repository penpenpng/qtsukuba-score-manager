import Vue from "vue"
import Vuex from "vuex"

import modules from "./modules"
import root from "./root"

Vue.use(Vuex)

const isProduction = process.env.NODE_ENV === "production"
let store = new Vuex.Store({
  ...root,
  modules,
  strict: !isProduction,
})

if (!isProduction) global.store = store

export default store