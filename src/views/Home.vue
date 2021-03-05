<template>
  <div class="home">
    <h1>Collections</h1>

    <p>
      <router-link :to="{ name: 'import' }">Import a collection</router-link>
    </p>

    <div class="error" v-if="collections.error">
      Error loading collections
    </div>

    <div
      class="loader_container"
      v-else-if="collections.loading">
      <Loader />
    </div>

    <template v-else-if="collections.length > 0">
      <ul>
        <li
          v-for="collection in collections"
          :key="collection">

          <router-link
            class="collection"
            :to="{ name: 'collection', params: {collection} }">
            {{collection}}
          </router-link>

        </li>
      </ul>


    </template>

    <div class="" v-else-if="collections.length < 1">
      No collections available
    </div>


  </div>
</template>

<script>
// @ is an alias to /src
import Loader from '@moreillon/vue_loader'

export default {
  name: 'Home',
  components: {
    Loader
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
      this.axios.get(`${process.env.VUE_APP_STORAGE_SERVICE_API_URL}/collections`)
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

li {
  margin: 1em 0;
}
.collection {

  color: currentcolor;
  text-decoration: none;
  font-weight: bold;
  transition: 0.25s;
}

.collection:hover {
  color: #c00000;
}

</style>
