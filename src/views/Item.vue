<template>
  <v-card>

    <BreadCrumbs />

    <!--<v-card-title>{{item_id}}</v-card-title>-->


    <v-card-text>
      <v-img
        height="400"
        contain
        :src="`${api_url}/collections/${collection_name}/images/${item_id}/image`"/>
    </v-card-text>


    <v-card-text>
      <v-list>
        <v-list-item
          v-for="(value, key) in item"
          :key="key">
          <v-list-item-content>
            <v-list-item-subtitle>{{key}}</v-list-item-subtitle>
            <v-list-item-title>{{value}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>

  </v-card>
</template>

<script>
import BreadCrumbs from '@/components/BreadCrumbs.vue'
export default {
  name: 'Item',
  data(){
    return {
      item: null,
      loading: false,
      api_url: process.env.VUE_APP_STORAGE_SERVICE_API_URL,
    }
  },

  components: {
    BreadCrumbs,
  },
  mounted(){
    this.get_item()
  },
  methods: {
    get_item(){
      const url = `${this.api_url}/collections/${this.collection_name}/images/${this.item_id}`
      this.axios.get(url)
      .then(({data}) => { this.item = data })
      .catch(error =>{
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
    },
  },
  computed: {
    collection_name(){
      return this.$route.params.collection_name
    },
    item_id() {
      return this.$route.params.item_id
    }
  }
}
</script>
