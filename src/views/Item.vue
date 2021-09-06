<template>
  <v-card>

    <v-toolbar flat>
      <BreadCrumbs />
      <!-- <v-toolbar-title>{{this.item_id}}</v-toolbar-title> -->
      <v-spacer/>
      <v-btn
        text
        color="#c00000"
        @click="delete_item()">
        <v-icon>mdi-delete</v-icon>
        <span>Delete</span>
      </v-btn>
      <!-- <template v-slot:extension>
        <BreadCrumbs />
      </template> -->
    </v-toolbar>
    <!-- <v-divider></v-divider> -->



    <!--<v-card-title>{{item_id}}</v-card-title>-->


    <v-card-text>
      <div class="image_container">
        <img
          :src="`${api_url}/collections/${collection_name}/images/${item_id}/image`">
      </div>



      <!-- <v-img
        height="400"
        contain
        :src="`${api_url}/collections/${collection_name}/images/${item_id}/image`"/> -->

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
    delete_item(){

      if(!confirm('ホンマに？')) return
      const url = `${this.api_url}/collections/${this.collection_name}/images/${this.item_id}`

      this.axios.delete(url)
      .then( () => { this.$router.push({name: 'collection', params: {collection: this.collection_name}}) })
      .catch(error =>{
        if(error.response) console.error(error.response.data)
        else console.error(error)
        alert(`Failed to delete entry`)
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

<style>
.image_container {
  text-align: center;
}

.image_container img {
  height: 400px;
}
</style>
