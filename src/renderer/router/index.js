import Vue from "vue"
import Router from "vue-router"


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "control-page",
      component: require("@/components/ControlPage").default,
    },
    {
      path: "/view",
      name: "view-page",
      component: require("@/components/ViewPage").default,
    },
  ],
})
