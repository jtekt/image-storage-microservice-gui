<template>
  <v-card>
    <v-card-title>
      {{collection_name || "Unnamed Collection"}}
    </v-card-title>
    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="items">
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Collection',

  components: {

  },
  data(){
    return {
      items: [],
      loading: false,
      headers: [
        {text: 'Time', value: "time"},
        {text: 'File', value: "image"},
      ],
    }
  },
  mounted(){
    this.get_items()
  },
  methods: {
    get_items(){
      this.loading = true
      const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/collections/${this.collection_name}/images`
      this.axios.get(url)
      .then(({data}) => {
        this.items = data
        this.items.forEach((item) => {
          for (let key in item) {
            const header_exists = this.headers.some(header => header.value === key)
            if(!header_exists) this.headers.push({text: key, value: key})
          }

        })

      })
      .catch((error) => {console.error(error)})
      .finally(() => {this.loading = false})
    },
  },
  computed: {
    collection_name(){
      return this.$route.params.collection_name
    }
  }

}
</script>

<style>
td, th {
  white-space: nowrap;
}
</style>
