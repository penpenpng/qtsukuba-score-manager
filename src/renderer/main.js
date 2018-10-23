import Vue from "vue"
import upperFirst from "lodash/upperFirst"
import camelCase from "lodash/camelCase"
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

ipcRenderer.on("notice-error", (e, text) => {
  alert(text)
})

const requireComponent = require.context("./components/Base", false)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, "$1")))

  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

Vue.mixin({
  methods: {
    push(type, payload) {
      ipcRenderer.send("push", type, payload)
    },
    selectAndReadCsv() {
      ipcRenderer.send("select-and-read-csv")
    }
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
