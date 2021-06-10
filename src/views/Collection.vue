<template>
  <v-card>
    <v-card-title>
      {{collection_name || "Unnamed Collection"}}
    </v-card-title>
    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="item_count"
        @click:row="$router.push({name: 'item', params: {item_id: $event._id}})">

        <!-- Thumbnails -->
        <template v-slot:item.image="{ item }">
          <v-img
            contain
            max-height="100"
            max-width="100"
            :src="`${api_url}/collections/${collection_name}/images/${item._id}/image`"
            alt="item"/>
        </template>

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
      item_count: 0,
      options: {},
      loading: false,
      headers: [
        {text: 'Image', value: "image"},
        {text: 'Time', value: "time"},
      ],
      api_url: process.env.VUE_APP_STORAGE_SERVICE_API_URL,
    }
  },
  mounted(){
    this.get_items()
    this.get_item_count()
  },
  watch: {
    options: {
      handler () {
        this.get_items()
      },
      deep: true,
    },
  },
  methods: {
    get_items(){
      this.loading = true
      const url = `${this.api_url}/collections/${this.collection_name}/images`
      const { page, itemsPerPage, sortBy, sortDesc } = this.options

      //console.log(sortBy, sortDesc)

      const sort = sortBy.reduce((acc, item, index) => {
        acc[item] = sortDesc[index] ? 1 : -1
        return acc
      }, {})


      const params = {
        start_index: (page-1) * itemsPerPage,
        limit: itemsPerPage === -1 ? 0 : itemsPerPage,
        sort,
      }


      this.axios.get(url, {params})
      .then(({data}) => {
        this.items = data
        this.build_headers(this.items)


      })
      .catch((error) => {console.error(error)})
      .finally(() => {this.loading = false})
    },
    get_item_count(){
      const url = `${this.api_url}/collections/${this.collection_name}`
      this.axios.get(url)
      .then(({data}) => { this.item_count = data.documents })
      .catch(error =>{
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
    },
    build_headers(items){
      items.forEach((item) => {
        for (let key in item) {
          const header_exists = this.headers.some(header => header.value === key)
          if(!header_exists) this.headers.push({text: key, value: key})
        }
      })
    }
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
