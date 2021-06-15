<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Collections</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        :to="{name: 'import'}">
        <v-icon>mdi-database-import</v-icon>
        <span>Import</span>
      </v-btn>
    </v-toolbar>
    <!--<v-card-title>Collections</v-card-title>-->
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="collection in collections"
          :key="collection"
          :to="{name: 'collection', params: {collection_name: collection}}">
          <v-list-item-content>
            <v-list-item-title>{{collection}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>



  </v-card>
</template>

<script>
//import BreadCrumbs from '@/components/BreadCrumbs.vue'

export default {
  name: 'Collections',

  components: {
    //BreadCrumbs
  },
  data(){
    return {
      collections: [],
      loading: false,
    }
  },
  mounted(){
    this.get_collections()
  },
  methods: {
    get_collections(){
      this.loading = true
      const url = `${process.env.VUE_APP_STORAGE_SERVICE_API_URL}/collections`
      this.axios.get(url)
      .then(({data}) => {this.collections = data})
      .catch((error) => {console.error(error)})
      .finally(() => {this.loading = false})
    },
  }

}
</script>
