<template>
  <div class="home">
    <h1>{{$route.params.entry_id}}</h1>



    <div class="" v-if="error">
      Error loading document
    </div>

    <div
      class="loader_container"
      v-else-if="loading">
      <Loader />
    </div>

    <template v-else-if="entry">
      <div class="image_wrapper">
        <img :src="image_src">
      </div>

      <h2>Image metadata</h2>
      <table>
        <tr>
          <td>URL</td>
          <td>{{image_src}}</td>
        </tr>
        <tr
          v-for="(value, key) in entry"
          v-bind:key="key">
          <td>{{key}}</td>
          <td>{{value}}</td>
        </tr>
      </table>

      <h2>Tools</h2>
      <button
        type="button"
        @click="delete_entry()">
        Delete entry
      </button>
    </template>




  </div>
</template>

<script>
// @ is an alias to /src
import Loader from '@moreillon/vue_loader'

export default {
  name: 'List',
  components: {
    Loader
  },
  data(){
    return {
      entry: null,
      loading: false,
      error: false,
      api_url: process.env.VUE_APP_TOKUSHIMA_STORAGE_API_URL
    }
  },
  mounted(){
    this.get_entry()
  },
  methods: {
    get_entry(){
      this.loading = true
      let collection = this.$route.params.collection
      let entry_id = this.$route.params.entry_id
      let url = `${this.api_url}/collections/${collection}/${entry_id}`
      this.axios.get(url)
      .then(response => {
        this.entry = response.data

      })
      .catch(error =>{
        this.error = true
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
      .finally(() => this.loading = false)
    },
    delete_entry(){

      if(confirm('ホンマに？')) {
        let collection = this.$route.params.collection
        let entry_id = this.$route.params.entry_id
        let url = `${this.api_url}/collections/${collection}/${entry_id}`

        this.axios.delete(url)
        .then( () => {
          this.$router.push({name: 'collection', params: {collection: collection}})
        })
        .catch(error =>{
          if(error.response) console.log(error.response.data)
          else console.log(error)
        })
      }
    },
    format_date(date){

      let options = {
        hour12: false,
        year:'numeric',
        month:'2-digit',
        day: '2-digit',
        hour:'2-digit',
        minute:'2-digit',
        second: '2-digit'
      }
      return new Date(date).toLocaleString('ja-JP', options)

    },
  },
  computed: {
    image_src(){
      return `${this.api_url}/images/${this.$route.params.collection}/${this.entry.image}`
    }
  }
}
</script>

<style scoped>

.image_wrapper {
  text-align: center;
  margin: 1em;

}
table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
}
td, th {
  padding: 0.25em;
}
td:first-child {
  font-weight: bold;
}
tr:not(:last-child){
  border-bottom: 1px solid #dddddd;
}
img {
  width: 30em;
}


</style>
