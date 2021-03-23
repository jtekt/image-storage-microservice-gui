<template>
  <div class="home">
    <h1>Import</h1>

    <div class="import_wrapper">
      <div class="service origin">
        <h2>Origin</h2>
        <div class="input_wrapper">
          <label for="">URL</label>
          <input type="text" v-model="origin">
        </div>



        <button type="button" @click="get_origin_collections()">Get collections</button>

        <template v-if="origin_collections.length > 0">
          <div class="">
            <label for="">Remote collection</label>
            <select class=""
              v-model="remote_collection"
              @change="local_collection = remote_collection">
              <option
                v-for="corigin_ollection in origin_collections"
                :key="corigin_ollection">
                {{corigin_ollection}}
              </option>
            </select>
          </div>
        </template>

      </div>

      <div class="transfer">
        <div class="">
          <button
            type="button"
            @click="collection_import()"
            :disabled="!remote_collection">
            <DatabaseImportIcon />
            <span>Transfer</span>
          </button>
        </div>
        <template v-if="progress > 0">
          <progress max="100" :value="progress"></progress>
        </template>
        <template v-if="progress === 100">
          <div class="success">
            Import successful
          </div>
        </template>
      </div>

      <div class="service destination">
        <h2>Destination</h2>
        <div class="input_wrapper">
          <label for="">Local collection</label>
          <input type="text" v-model="local_collection" placeholder="Collection name">
        </div>
      </div>
    </div>











  </div>
</template>

<script>
// @ is an alias to /src
import DatabaseImportIcon from 'vue-material-design-icons/DatabaseImport.vue'

export default {
  name: 'Home',
  components: {
    DatabaseImportIcon,
  },
  data(){
    return {
      origin_collections: [],
      remote_collection: '',
      local_collection: '',
      origin: 'http://10.34.99.193:31221',
      progress: 0,
    }
  },
  mounted(){

  },
  sockets: {
    import_progress(payload) {
      this.progress = payload.progress * 100
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

.import_wrapper{
  display: flex;
  align-items: center;
}

.service_icon {
  font-size: 200%;
}

.import_wrapper > :is(.service, .transfer) {
  flex-grow: 1;
  flex-basis: 0;

  display: flex;
  //justify-content: center;
  align-items: center;
  flex-direction: column;
}

.transfer {
  margin-top: 2em;
  align-self: flex-start;
}

.service {
  border: 1px solid #dddddd;
  border-radius: 0.5em;
  padding: 0.5em 1em;
  height: 12em;
}

.import_wrapper > * > * {
  margin: 0.5em;
}

label {
  margin-right: 0.5em;
}

.success {
  color: #00c000;
  font-weight: bold;
}

.input_wrapper {
  width: 100%;
  display: flex;
}

.input_wrapper input {
  flex-grow: 1;
}

</style>
