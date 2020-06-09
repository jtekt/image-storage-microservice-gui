<template>
  <div class="home">
    <h1>{{$route.query.collection}}</h1>

    <div class="" v-if="collection.error">
      Error loading collection
    </div>

    <div class="loader_container" v-else-if="collection.loading">
      <Loader />
    </div>

    <table v-else-if="collection.length > 0">
      <tr>
        <th>Image</th>
        <th>Time</th>
        <th>Name</th>

        <template v-if="collection.find(doc => {return !!doc.AI})">
          <th>AI prediction (NG probability)</th>
          <th>AI version</th>
          <th>AI inference time [s]</th>
        </template>

        <th>Mode</th>

      </tr>

      <tr
        class="doc"
        v-for="doc in collection"
        :key="doc._id"
        @click="$router.push({name: 'Entry', query: {id: doc._id, collection: $route.query.collection}})">


        <td><img :src="`${api_url}/${doc.image}`"></td>
        <td>{{format_date(doc.time)}}</td>
        <td>{{doc.image_id}}</td>

        <template v-if="doc.AI">
          <td>{{Math.round(doc.AI.prediction*1000)/1000}}</td>
          <td>{{doc.AI.version}}</td>
          <td>{{Math.round(doc.AI.inference_time*1000)/1000}}</td>
        </template>

        <td>{{doc.demo}}</td>


      </tr>
    </table>

    <div class="" v-else-if="collection.length === 0">
      Collection is empty
    </div>

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
      collection: [],
      api_url: 'http://172.16.98.151:31616'
    }
  },
  mounted(){
    this.get_list(this.$route.query.collection)
  },
  beforeRouteUpdate (to, from, next) {
    this.get_list(to.query.collection)
    next()
  },

  methods: {
    get_list(collection){
      this.$set(this.collection,'loading',true)
      this.axios.get(`${process.env.VUE_APP_TOKUSHIMA_STORAGE_API_URL}/all`, {
        params: {collection: collection}
      })
      .then(response => {
        this.collection = []
        response.data.forEach((doc) => {
          this.collection.push(doc)
        });
      })
      .catch(error =>{
        this.$set(this.collection,'error',true)
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
      .finally(()=>{this.$set(this.collection,'loading',false)})
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

    }
  },
}
</script>

<style scoped>
h1 {
  text-transform: capitalize;
}
table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
}
td, th {
  padding: 0.25em;
}
tr:not(:last-child){
  border-bottom: 1px solid #dddddd;
}
tr:not(:first-child) {
  cursor: pointer;
  transition: background-color 0.25s;
}
tr:not(:first-child):hover {
  background-color: #eeeeee;
}

.doc img {
  width: 5em;
}

.loader_container {
  text-align: center;
  font-size: 200%;
}

</style>
