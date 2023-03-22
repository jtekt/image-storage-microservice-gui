<template>
  <AppTemplate :options="options">
    <template v-slot:nav>
      <v-list dense nav>
        <v-list-item>
          <LocaleSelector />
        </v-list-item>
        <v-divider />

        <v-list-item :to="{ name: 'images' }" exact>
          <v-list-item-icon>
            <v-icon>mdi-image-multiple</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ $t("Images") }}</v-list-item-title>
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

        <NavCategories />
      </v-list>
    </template>
  </AppTemplate>
</template>

<script>
import AppTemplate from "@moreillon/vue_application_template_vuetify"
import LocaleSelector from "./components/LocaleSelector.vue"
import NavCategories from "./components/NavCategories.vue"

const { VUE_APP_IDENTIFICATION_URL, VUE_APP_LOGIN_URL } = process.env

export default {
  name: "App",

  components: {
    AppTemplate,
    LocaleSelector,
    NavCategories,
  },

  data: () => ({
    options: {
      title: "Image storage service",
      login_url: VUE_APP_LOGIN_URL,
      identification_url: VUE_APP_IDENTIFICATION_URL,
      header_logo: require("@/assets/jtekt_logo_negative.jpg"),
      authentication_logo: require("@/assets/jtekt_logo.jpg"),
      colors: { app_bar: "#000" },
      author: "Maxime MOREILLON, JTEKT Corporation",
    },
  }),
}
</script>

<style>
.header_logo {
  border-right: 1px solid white;
}
</style>
