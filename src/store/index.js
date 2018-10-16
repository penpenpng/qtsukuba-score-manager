import Vue from "vue"
import Vuex from "vuex"

import modules from "./modules"
import root from "./root"

Vue.use(Vuex)

export default new Vuex.Store({
  ...root,
  modules,
  strict: process.env.NODE_ENV !== "production",
})
