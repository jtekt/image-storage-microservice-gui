/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import axios from "axios";
import { registerPlugins } from '@/plugins'
import i18n from "@/locales";
import VueCookies from "vue-cookies";
import { setupAxiosAuth } from "./plugins/axios";

import { auth } from "@moreillon/vue-oidc";
const { VITE_OIDC_AUTHORITY, VITE_OIDC_CLIENT_ID } = import.meta.env

axios.defaults.baseURL = import.meta.env.VITE_IMAGE_STORAGE_API_URL;
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import VueAxios from "vue-axios";

const app = createApp(App)

if (VITE_OIDC_AUTHORITY &&
    VITE_OIDC_CLIENT_ID) {
    app.use(auth, {
        authority: VITE_OIDC_AUTHORITY,
        client_id: VITE_OIDC_CLIENT_ID,
    });
    setupAxiosAuth();
}
registerPlugins(app);

app.use(VueAxios, axios);
app.use(VueCookies);
app.use(i18n);
app.provide("axios", app.config.globalProperties.axios);
app.mount('#app')
