import Vue from "vue"
import axios from "axios"

import App from "./App"
import router from "./router"
import store from "../store"

import { ipcRenderer } from "electron"

if (!process.env.IS_WEB) Vue.use(require("vue-electron"))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

ipcRenderer.on("postback", (e, type, payload) => {
  store.commit(type, payload)
})

ipcRenderer.on("initialize", (e, state) => {
  store.replaceState(state)
})

Vue.mixin({
  methods: {
    push(type, payload) {
      ipcRenderer.send("push", type, payload)
    },
  },
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  created() {
    ipcRenderer.send("fetch")
  },
  template: "<App/>",
}).$mount("#app")
