import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

  {
    path: '/collections',
    name: 'collections',
    component: () => import('../views/Collections.vue')
  },
  {
    path: '/import',
    name: 'import',
    component: () => import('../views/Import.vue')
  },
  {
    path: '/collections/:collection_name',
    name: 'collection',
    component: () => import('../views/Collection.vue')
  },
  {
    path: '/collections/:collection_name/items/:item_id',
    name: 'item',
    component: () => import('../views/Item.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/',
    redirect: {name: 'collections'},
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
