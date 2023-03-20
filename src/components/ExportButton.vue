<template>
  <v-btn text block @click="export_collection()">
    <v-icon left>mdi-download</v-icon>
    <span>Export</span>
  </v-btn>
</template>

<script>
export default {
  name: "ExportButton",
  data() {
    return {}
  },
  methods: {
    export_collection() {
      const { limit, skip, sort, order, ...params } = this.query // eslint-disable-line no-unused-vars
      const url = new URL(`${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/export`)

      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key])
      })

      window.open(url.toString(), "_blank")
    },
  },
  computed: {
    query() {
      return this.$route.query
    },
  },
}
</script>
