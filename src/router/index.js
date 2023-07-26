import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/images",
    alias: "/",
    name: "images",
    component: () => import("../views/Images.vue"),
  },
  {
    path: "/folders",
    name: "folders",
    component: () => import("../views/Folders.vue"),
  },
  {
    path: "/images/:_id",
    name: "image",
    component: () => import("../views/Image.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
