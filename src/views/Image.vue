<template>
  <v-card
    :loading="loading">
    <v-toolbar flat>

      <v-row align='center'>
        <v-col cols="auto">
          <v-btn
            text
            exact
            :to="{name: 'images'}">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-toolbar-title>{{image_id}}</v-toolbar-title>
        </v-col>
        <v-spacer/>
        <v-col cols="auto">
          <v-btn
            :disabled="loading"
            color="#c00000"
            dark
            @click="delete_item()">
            <v-icon>mdi-delete</v-icon>
            <span class='ml-2'>Delete</span>
          </v-btn>
        </v-col>
      </v-row>



    </v-toolbar>
    <v-divider/>

    <template v-if="item">

      <!-- Image -->
      <div class="text-center mt-5">
        <img
          class="item_image"
          :src="image_src"/>
      </div>



      <v-card-text>
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
                <v-list-item-title >{{time_formatted}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>File name</v-list-item-subtitle>
                <v-list-item-title>{{item.file}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list>
            <v-list-item
              v-for="(value, key) in item.data"
              :key="key">
              <v-list-item-content>
                <v-list-item-subtitle>{{key}}</v-list-item-subtitle>
                <v-list-item-title>{{value}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card-text>
    </template>


  </v-card>

</template>

<script>
export default {
  name: 'Images',
  data(){
    return {
      loading: false,
      item: null,
    }
  },
  mounted(){
    this.get_item()
  },
  computed: {
    image_id() {
      return this.$route.params._id
    },
    image_src(){
      return `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images/${this.image_id}/image`
    },
    time_formatted(){
      const date = new Date(this.item.time)
      const date_formatted =  date.toLocaleString('ja-JP')
      return date_formatted
    }

  },
  methods: {
    get_item(){
      this.loading = true
      this.item = null
      const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images/${this.image_id}`
      this.axios.get(url)
      .then( ({data}) => {
        this.item = data
       })
      .catch( (error) => {
        alert('Failed to query data')
        console.error(error)
      })
      .finally(() => {
        this.loading = false
      })
    },
    delete_item(){
      if(!confirm(`Delete image ${this.image_id}?`)) return
      this.loading = true
      const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images/${this.image_id}`
      this.axios.delete(url)
      .then( () => { this.$router.push({name: 'images'}) })
      .catch( (error) => {
        alert('Failed to delete data')
        console.error(error)
      })
      .finally(() => {
        this.loading = false
      })
    },

  },

}
</script>

<style scoped>
.item_image {
  max-height: 60vh;
}
</style>