import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Images.vue')
  },
  {
    path: '/images',
    name: 'images',
    component: () => import('../views/Images.vue')
  },
  {
    path: '/images/:_id',
    name: 'image',
    component: () => import('../views/Image.vue')
  },
  {
    path: '/import',
    name: 'import',
    component: () => import('../views/Import.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
