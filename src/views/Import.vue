<template>
  <div class="home">
    <h1>Import</h1>

    <form class="" @submit.prevent="get_origin_collections()">
      <p>
        <label for="">Origin</label>
        <input type="text" v-model="origin">
        <input type="submit" value="Query collections">
      </p>

    </form>

    <template v-if="origin_collections.length > 0">
      <form class=""
        @submit.prevent="collection_import()">
        <p class="">
          <label for="">Remote collection</label>
          <select class="" v-model="remote_collection" @change="local_collection = remote_collection">
            <option
              v-for="corigin_ollection in origin_collections"
              :key="corigin_ollection">
              {{corigin_ollection}}
            </option>
          </select>
        </p>

        <template v-if="remote_collection">
          <p class="" v-if="remote_collection">
            <label for="">Local collection</label>
            <input type="text" v-model="local_collection">

          </p>

          <p class="">
            <input type="submit" value="import">
          </p>
        </template>




      </form>
    </template>

    <template v-if="progress > 0">
      <progress max="100" :value="progress"></progress>
    </template>
    <template v-if="progress === 100">
      <div class="">
        Import successful
      </div>
    </template>



  </div>
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
      origin: 'http://172.16.99.115:31221',
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
    get_current_collections(){

    },
    get_origin_collections(){
      this.origin_collections = []
      const url = `${this.origin}/collections`
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
      const url = `${process.env.VUE_APP_STORAGE_SERVICE_API_URL}/collections/import`
      const options = {
        params: {
          origin: this.origin,
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

form p > *:not(:last-child) {
  margin-right: 0.5em;
}

</style>
