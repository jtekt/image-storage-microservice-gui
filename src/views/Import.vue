<template>
  <v-card>

    <v-toolbar
      flat>

      <v-btn
        icon
        :to="{name: 'collections'}">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>Collection import</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-container fluid>
        <v-row align="stretch">
          <v-col>
            <v-card>
              <v-card-title>Origin</v-card-title>
              <v-card-text>
                <v-textField
                  label="Origin URL"
                  type="text" v-model="origin"/>




              </v-card-text>
              <v-card-text>
                <v-btn type="button" @click="get_origin_collections()">Get collections</v-btn>
              </v-card-text>
              <v-card-text>
                <v-select
                  v-model="remote_collection"
                  v-if="origin_collections.length > 0"
                  @change="local_collection = remote_collection"
                  :items="origin_collections"
                  label="Collection" />
              </v-card-text>


            </v-card>
          </v-col>
          <v-col>
            <v-card
              flat
              class="text-center">


              <v-card-text>
                <v-btn
                  @click="collection_import()">
                  <v-icon>mdi-database-import</v-icon>
                  <span>Transfer</span>
                </v-btn>
              </v-card-text>

              <v-card-text>
                <v-progress-linear
                  v-if="progress > 0"
                  :value="progress"/>
              </v-card-text>

              <v-card-text
                v-if="progress === 100 && !import_errors.length"
                class="green--text">
                Import successful
              </v-card-text>

              <v-card-text
                v-if="progress === 100 && import_errors.length"
                class="red--text">
                Import finished with the following errors
              </v-card-text>

              <v-card-text
                v-if="import_errors.length"
                class="red--text">
                <div class=""
                  v-for="(error, i) in import_errors"
                  :key="`Error ${i}`">
                  {{error}}
                </div>
              </v-card-text>





            </v-card>



          </v-col>
          <v-col>
            <v-card>
              <v-card-title>
                Destination
              </v-card-title>
              <v-card-text>
                <v-textField
                  label="Local collection name"
                  type="text" v-model="local_collection"/>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
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
      origin_collections: [],
      remote_collection: '',
      local_collection: '',
      origin: process.env.VUE_APP_STORAGE_SERVICE_API_URL,
      progress: 0,
      import_errors: [],
    }
  },
  mounted(){

  },
  sockets: {
    import_progress({progress}) {
      this.progress = progress * 100
    },
    import_error({error}) {
      this.import_errors.push(error)
    }
  },
  methods: {
    parse_orign_url(){
      let origin
      try {
        origin = new URL(this.origin).origin
      } catch (e) {
        console.error(e)
        return false
      }
      return origin
    },
    get_origin_collections(){
      const origin = this.parse_orign_url()
      if(!origin) return alert('Invalid URL')

      this.origin_collections = []
      const url = `${origin}/collections`
      this.axios.get(url)
      .then(response => {
        response.data.forEach((collection) => {
          this.origin_collections.push(collection)
        })

      })
      .catch(error =>{
        if(error.response) console.log(error.response.data)
        else console.log(error)
        alert(`Something went wrong`)
      })
    },
    collection_import() {
      this.import_errors = []
      const origin = this.parse_orign_url()
      if(!origin) return alert('Invalid URL')

      const url = `${process.env.VUE_APP_STORAGE_SERVICE_API_URL}/collections/import`
      const options = {
        params: {
          origin,
          remote_collection: this.remote_collection,
          local_collection: this.local_collection,
        }
      }
      this.axios.get(url, options)
      .then(() => {

      })
      .catch(error =>{
        if(error.response) console.log(error.response.data)
        else console.log(error)
        alert(`Something went wrong`)
      })
    }
  }
}
</script>

<style scoped>


</style>
