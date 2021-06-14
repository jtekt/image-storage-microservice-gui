import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import io from 'socket.io-client'
import VueAxios from 'vue-axios'
import VueSocketIOExt from 'vue-socket.io-extended'

const socket = io(process.env.VUE_APP_WS_SERVER_URL)

Vue.use(VueAxios, axios)
Vue.use(VueSocketIOExt, socket);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
