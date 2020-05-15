<template>
  <div class="home">
    <h1>{{$route.query.collection}}</h1>

    <table v-if="collection.length > 0">

      <tr>
        <th>Image</th>
        <th>Time</th>
        <th>Name</th>

        <template v-if="collection.find(doc => {return !!doc.AI})">
          <th>prediction</th>
          <th>version</th>
          <th>Inference time [s]</th>
        </template>

      </tr>

      <tr
        class="doc"
        v-for="doc in collection"
        :key="doc._id"
        @click="$router.push({name: 'Entry', query: {id: doc._id, collection: $route.query.collection}})">


        <td><img :src="`${api_url}/${doc.image}`"></td>
        <td>{{doc.time}}</td>
        <td>{{doc.image_id}}</td>

        <template v-if="doc.AI">
          <td>{{Math.round(doc.AI.prediction*1000)/1000}}</td>
          <td>{{doc.AI.version}}</td>
          <td>{{Math.round(doc.AI.inference_time*1000)/1000}}</td>
        </template>


      </tr>

    </table>

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
      collection: [],
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
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
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

</style>
