import Vue from "vue"
import axios from "axios"

import App from "./App"
import router from "./router"
import store from "./store"

import { ipcRenderer, remote } from "electron"

if (!process.env.IS_WEB) Vue.use(require("vue-electron"))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

ipcRenderer.on("updated-master", (e, type, payload) => {
  store.commit(type, payload)
})

Vue.mixin({
  methods: {
    push(type, payload) {
      remote.getGlobal("push")(type, payload)
    },
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app")
