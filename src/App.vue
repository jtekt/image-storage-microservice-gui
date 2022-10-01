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

        <v-list-item :to="{name: 'images'}" exact>
          <v-list-item-icon>
            <v-icon>mdi-image-multiple</v-icon>
          </v-list-item-icon>
        
          <v-list-item-content>
            <v-list-item-title>All images</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group 
          :value="true" 
          no-action 
          v-if="field_name"
          prepend-icon="mdi-format-list-bulleted">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{field_name}}</v-list-item-title>
            </v-list-item-content>
          </template>
        
          <v-list-item 
            v-for="(fieldValue, i) in fieldValues" 
            :key="i" 
            link
            exact
            :to="{name: 'images', query: {[field_name]: fieldValue}}">
            <v-list-item-icon>
              <v-icon>mdi-image-multiple</v-icon>
            </v-list-item-icon>
            
            <v-list-item-content>
              <v-list-item-title>{{fieldValue}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item :to="{name: 'about'}" exact>
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

    // TODO: find better name for this env var
    field_name: process.env.VUE_APP_CLASSIFICATION_FIELD_NAME,
    fieldValues: [],
  }),

  mounted(){
    this.get_field_values()
  },


  methods: {
    async get_field_values(){
      if (!this.field_name) return
      const {data} = await this.axios.get(`/fields/${this.field_name}`)
      this.fieldValues = data
    }
  },

  computed: {
    nav(){
      return [
        { title: this.$t('Images'), to: {name: 'images'}, icon: 'mdi-image-multiple' },
        { title: this.$t('About'), to: {name: 'about'}, icon: 'mdi-information-outline' },
      ]
    }
  }
}
</script>
