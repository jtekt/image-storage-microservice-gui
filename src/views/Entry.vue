<template>
  <div class="home">
    <h1>Entry</h1>

    <div class="" v-if="error">
      Error loading document
    </div>

    <div class="loader_container" v-else-if="loading">
      <Loader />
    </div>

    <template  v-else-if="entry">
      <div class="image_wrapper">
        <img :src="`${api_url}/${entry.image}`">
      </div>

      <table>
        <tr>
          <th colspan="2">Image metadata</th>
        </tr>
        <tr>
          <td>ID</td>
          <td>{{entry._id}}</td>
        </tr>
        <tr>
          <td>Date</td>
          <td>{{format_date(entry.time)}}</td>
        </tr>
        <tr>
          <td>Image info</td>
          <td>{{entry.image_info}}</td>
        </tr>

        <!-- AI results -->
        <template v-if="entry.AI">
          <tr>
            <td colspan="2">AI results</td>
          </tr>
          <tr>
            <td>Prediction</td>
            <td>{{entry.AI.prediction}}</td>
          </tr>
          <tr>
            <td>Inference time</td>
            <td>{{entry.AI.inference_time}}</td>
          </tr>
          <tr>
            <td>Model version</td>
            <td>{{entry.AI.version}}</td>
          </tr>
        </template>

        <tr>
          <th colspan="2">Actions</th>
        </tr>
        <tr>
          <td>Delete</td>
          <td>
            <button type="button" @click="delete_entry()">Delete</button>
          </td>
        </tr>

      </table>
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
      let url = `${this.api_url}/images/${this.$route.query.id}`
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
        let url = `${this.api_url}/images/${this.$route.query.id}`

        this.axios.delete(url)
        .then( () => {
          this.$router.push({name: 'List'})
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

.loader_container {
  text-align: center;
  font-size: 200%;
}

</style>
