<template>
    <AppTemplate :options="options" @user="updateUser">
        <template v-slot:nav>
            <v-list dense nav>
                <v-list-item>
                    <LocaleSelector />
                </v-list-item>
                <v-divider />

                <v-list-item
                    :to="{
                        name: 'images',
                        query: {
                            limit: '10',
                            sort: 'time',
                            order: '-1',
                            skip: '0',
                        },
                    }"
                    exact
                >
                    <v-list-item-icon>
                        <v-icon>mdi-image-multiple</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{
                            $t('Images')
                        }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <NavCategories v-if="categorizer" />

                <v-list-item
                    :to="{ name: 'folders' }"
                    exact
                    v-if="folderStructure"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-file-tree</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{
                            $t('Folder')
                        }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item :to="{ name: 'about' }" exact>
                    <v-list-item-icon>
                        <v-icon>mdi-information-outline</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>About</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </template>
    </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'
import LocaleSelector from './components/LocaleSelector.vue'
import NavCategories from './components/NavCategories.vue'
import { getAuthenticationToken } from './utils/auth.js'

const {
    VUE_APP_IDENTIFICATION_URL,
    VUE_APP_LOGIN_URL,
    VUE_APP_CATEGORIZER,
    VUE_APP_FOLDER_STRUCTURE,
    VUE_APP_OIDC_AUTHORITY,
    VUE_APP_OIDC_CLIENT_ID,
    VUE_APP_OIDC_AUDIENCE,
} = process.env

export default {
    name: 'App',

    components: {
        AppTemplate,
        LocaleSelector,
        NavCategories,
    },

    data: () => ({
        categorizer: VUE_APP_CATEGORIZER,
        folderStructure: VUE_APP_FOLDER_STRUCTURE,
        options: {
            title: 'Image storage service',
            login_url: VUE_APP_LOGIN_URL,
            identification_url: VUE_APP_IDENTIFICATION_URL,
            oidc: {
                authority: VUE_APP_OIDC_AUTHORITY,
                client_id: VUE_APP_OIDC_CLIENT_ID,
                extraQueryParams: {
                    audience: VUE_APP_OIDC_AUDIENCE,
                },
            },
            header_logo: require('@/assets/jtekt_logo_negative.jpg'),
            authentication_logo: require('@/assets/jtekt_logo.jpg'),
            colors: { app_bar: '#000' },
            author: 'Maxime MOREILLON, JTEKT Corporation',
        },
    }),

    methods: {
        updateUser() {
            const token = getAuthenticationToken(this.$cookies)

            // setting or unsetting the header depends on jwt being in cookies
            if (token) {
                this.axios.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${token}`
            } else {
                delete this.axios.defaults.headers.common['Authorization']
            }
        },
    },
}
</script>

<style>
.header_logo {
    border-right: 1px solid white;
}
</style>
