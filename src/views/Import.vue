<template>
  <v-card max-width="500px" class="mx-auto">

    <v-toolbar
      flat>

      <v-btn
        icon
        exact
        :to="{name: 'images'}">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>Import</v-toolbar-title>
    </v-toolbar>
    <v-divider />

    <v-card-text>
      <v-form
        @submit.prevent="import_collection()">

        <v-row align="center">
          <v-col>
            <v-file-input
              accept=".zip"
              label="Collection archive (.zip)"
              v-model="archive"/>
          </v-col>
          <v-col cols="auto">
            <v-btn
              type="submit"
              :loading="uploading"
              :disabled="!archive">
              <v-icon>mdi-upload</v-icon>
              <span>Import</span>
            </v-btn>
          </v-col>
        </v-row>




       </v-form>

    </v-card-text>

  </v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },
  data(){
    return {
      uploading: false,
      archive: null,
    }
  },
  mounted(){

  },

  methods: {
    import_collection() {
      this.uploading = true
      const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/import`

      const headers = {'Content-Type': 'multipart/form-data' }
      const body = new FormData()
      body.append('archive', this.archive)

      this.axios.post(url, body, { headers })
      .then( () => {
        this.$router.push({name: 'images'})

      })
      .catch(error =>{
        if(error.response) console.log(error.response.data)
        else console.log(error)
        alert(`Something went wrong`)
      })
      .finally( () => { this.uploading = false })

    }
  }
}
</script>

<style scoped>


</style>
