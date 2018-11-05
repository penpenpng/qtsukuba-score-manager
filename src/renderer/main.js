import "animate.css/animate.css"
import Vue from "vue"
import axios from "axios"
import {
  upperFirst,
  camelCase,
} from "lodash"
import {
  ipcRenderer
} from "electron"
import {
  readFileSync
} from "fs"
import {
  parse as parsePath
} from "path"

import App from "./App"
import router from "./router"
import store from "../store"


window.addEventListener("load", main)

function main() {
  if (!process.env.IS_WEB) Vue.use(require("vue-electron"))
  Vue.http = Vue.prototype.$http = axios
  Vue.config.productionTip = false

  registerIpcEvents()
  loadBaseComponents()
  mixinCommonMethods()

  new Vue({
    components: { App },
    router,
    store,
    created() {
      ipcRenderer.send("fetch")
    },
    template: "<App/>",
  }).$mount("#app")
}

function registerIpcEvents() {
  ipcRenderer.on("postback", (e, type, payload) => {
    store.commit(type, payload)
  })
  
  ipcRenderer.on("initialize", (e, state) => {
    store.replaceState(state)
  })
  
  ipcRenderer.on("notice", (e, text) => {
    alert(text)
  })
}

function loadBaseComponents() {
  const requireComponent = require.context("./components/Base", false)
  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const componentName = upperFirst(camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, "$1")))
  
    Vue.component(
      componentName,
      componentConfig.default || componentConfig
    )
  })
}

function mixinCommonMethods() {
  Vue.mixin({
    methods: {
      push(type, payload) {
        ipcRenderer.send("push", type, payload)
      },
      loadImageAsBase64(path) {
        const { ext } = parsePath(path)
        if (/png/i.test(ext)) {
          return "data:image/png;base64," + readFileSync(path, "base64")
        } else if (/jpe?g/i.test(ext)) {
          return "data:image/jpeg;base64," + readFileSync(path, "base64")
        } else {
          return ""
        }
      }
    },
  })
}
