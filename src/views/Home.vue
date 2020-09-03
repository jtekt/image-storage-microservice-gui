<template>
  <div class="home">
    <h1>Storage microservice GUI</h1>
    <h2>Available collections</h2>

    <ul>
      <li
        v-for="collection in collections"
        :key="collection.name">
        <router-link
          class="collection"

          :to="{ name: 'collection', params: {collection: collection.name} }">
          {{collection.name}}
        </router-link>
      </li>
    </ul>


  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {

  },
  data(){
    return {
      collections: [],
    }
  },
  mounted(){
    this.get_collections()
  },
  methods: {
    get_collections() {
      this.$set(this.collections,'loading',true)
      this.axios.get(`${process.env.VUE_APP_TOKUSHIMA_STORAGE_API_URL}/collections`)
      .then(response => {
        this.collections = []
        response.data.forEach((doc) => {
          this.collections.push(doc)
        });
      })
      .catch(error =>{
        this.$set(this.collections,'error',true)
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
      .finally(()=>{this.$set(this.collections,'loading',false)})
    }
  }
}
</script>

<style scoped>

.collection {
  display: flex;
  padding: 0.25em 0;
  color: #c00000;
  text-decoration: none;
  font-weight: bold;

}


</style>
