<template>
  <v-card max-width="800px" class="mt-5 mx-auto">



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
    <v-divider></v-divider>

    <template v-if="!loading && item">
      <!-- Not using v-img because can"t right click -->
      <v-card-text>
        <div class="image_container">
          <img :src="`${api_url}/collections/${collection_name}/images/${item_id}/image`">
        </div>
      </v-card-text>


      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>ID</v-list-item-subtitle>
              <v-list-item-title>{{item._id}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Time</v-list-item-subtitle>
              <v-list-item-title >{{format_date(item.time)}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Image</v-list-item-subtitle>
              <v-list-item-title>{{item.image}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item
            v-for="(value, key) in properties_classified.free"
            :key="key">
            <v-list-item-content>
              <v-list-item-subtitle>{{key}}</v-list-item-subtitle>
              <v-list-item-title>{{value}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </template>

    <v-card-text v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate></v-progress-circular>
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
    format_date(raw_date){
      const date = new Date(raw_date)
      const date_formatted =  date.toLocaleString('ja-JP')
      return date_formatted
    },

  },
  computed: {
    collection_name(){
      return this.$route.params.collection_name
    },
    item_id() {
      return this.$route.params.item_id
    },
    properties_classified(){
      const {_id, time, image, ...properties} = this.item
      return {mandatory: {_id, time, image}, free: properties}
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
