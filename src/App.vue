<template>
  <AppTemplate
    :options="options">

    <template v-slot:nav>
      <v-list
        dense
        nav >
        <v-list-item>
          <LocaleSelector />
        </v-list-item>
        <v-divider />

        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

  </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'
import LocaleSelector from './components/LocaleSelector.vue'


export default {
  name: 'App',

  components: {
    AppTemplate,
    LocaleSelector
  },

  data: () => ({
    options: {
      title: 'Image storage service',
      login_url: process.env.VUE_APP_LOGIN_URL,
      identification_url: process.env.VUE_APP_IDENTIFICATION_URL,
    },
  }),

  computed: {
    nav(){
      return [
        { title: this.$t('Images'), to: {name: 'images'}, icon: 'mdi-home' },
        { title: this.$t('About'), to: {name: 'about'}, icon: 'mdi-information-outline' },
      ]
    }
  }
}
</script>
