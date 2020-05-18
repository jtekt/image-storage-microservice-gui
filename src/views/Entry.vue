<template>
  <div class="home">
    <h1>Entry</h1>

    <template  v-if="entry">
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
          <td>{{entry.time}}</td>
        </tr>
        <tr>
          <td>Original file name</td>
          <td>{{entry.image_id}}</td>
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
            <td>Pnference time</td>
            <td>{{entry.AI.inference_time}}</td>
          </tr>
          <tr>
            <td>Podel version</td>
            <td>{{entry.AI.version}}</td>
          </tr>
        </template>

        <tr>
          <th colspan="2">Tools</th>
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

export default {
  name: 'List',
  components: {

  },
  data(){
    return {
      entry: null,
    }
  },
  mounted(){
    this.get_entry()
  },
  methods: {
    get_entry(){
      this.axios.get(`${process.env.VUE_APP_TOKUSHIMA_STORAGE_API_URL}/document`, {
        params: {
          collection: this.$route.query.collection,
          id: this.$route.query.id,
        }
      })
      .then(response => {
        this.entry = response.data

      })
      .catch(error =>{
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
    },
    delete_entry(){

      if(confirm('ホンマに？')) {
        this.axios.delete(`${process.env.VUE_APP_TOKUSHIMA_STORAGE_API_URL}/document`, {
          params: {
            collection: this.$route.query.collection,
            id: this.$route.query.id,
          }
        })
        .then( () => {
          this.$router.push({name: 'List', query: {collection: this.$route.query.collection,} })
        })
        .catch(error =>{
          if(error.response) console.log(error.response.data)
          else console.log(error)
        })
      }


    }
  },
  computed: {
    api_url(){
      //return process.env.VUE_APP_TOKUSHIMA_STORAGE_API_URL
      return 'http://172.16.98.151:31616'
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
.doc img {
  width: 5em;
}

</style>
