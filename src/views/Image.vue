<template>
  <v-card>
    <v-toolbar flat>
      <v-btn
        text
        exact
        :to="{name: 'images'}">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{image_id}}</v-toolbar-title>
    </v-toolbar>
    <v-divider/>

    <v-card-text
      v-if="loading"
      class="text-center">
      <v-progress-circular indeterminate/>
    </v-card-text>

    <template v-if="item">
      <div class="text-center">
        <img
          class="item_image"
          :src="image_src"/>
      </div>


      <v-card-text>
        <v-row
          v-for="(value,key) in item.data"
          :key="key">
          <v-col>
            {{key}}: {{value}}
          </v-col>
        </v-row>
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
    }
  }
}
</script>

<style scoped>
.item_image {
  max-height: 60vh;
}
</style>
