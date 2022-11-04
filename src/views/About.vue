<template>
  <v-card>
    <v-toolbar flat>
      <v-btn
        icon
        exact
        :to="{name: 'images'}">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Image storage service GUI</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <p>Developed and maintainted by Maxime Moreillon, JTEKT Corporation</p>
      <v-data-table
        hide-default-footer
        :itemsPerPage="-1"
        :headers="headers"
        :items="services"/>
    </v-card-text>


  </v-card>
</template>

<script>
import pjson from '@/../package.json'
export default {
  name: 'About',
  data () {
    return {
      headers: [
        {text: 'Service', value: "name"},
        {text: 'Version', value: "version"},
        {text: 'URL', value: "url"},

      ],
      services: [
        {
          name: 'Image storage GUI',
          url: window.location.origin,
          version: pjson.version
        },
        {
          name: 'Image storage Back-end',
          url: process.env.VUE_APP_IMAGE_STORAGE_API_URL,
          version: null
        },
      ],
    }
  },
  mounted () {
    this.get_services_version()
  },
  methods: {

    get_services_version () {
      this.services.forEach((service) => {
        if (service.version) return
        service.version = 'Connecting...'
        this.axios.get(service.url)
          .then(({ data }) => { service.version = data.version })
          .catch(() => { service.version = 'Unable to connect' })
      })
    }
  }

}
</script>

<style scoped>


</style>
