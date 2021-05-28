<template>
  <div class="home">

    <h1>{{collection_name}}</h1>


    <div
      class="error"
      v-if="error && !loading">
      Error loading collection
    </div>



    <template v-if="!error">

      <p>
        Collection {{collection_name}} contains {{count}} item(s)
      </p>

      <div class="buttons_wrapper">
        <button
          class="dangerous"
          type="button"
          @click="drop_collection()">
          <DeleteIcon />
          <span>Delete</span>
        </button>
        <button type="button" @click="export_collection()">
          <DatabaseExportIcon />
          <span>Export</span>
        </button>

        <div class="spacer"/>

        <input type="text" v-model="search_query" placeholder="JSON">
        <button
          type="button"
          @click="search()"
          :disabled="!search_valid">
          <MagnifyIcon />
          <span>Search</span>
        </button>
      </div>



      <template v-if="collection.length > 0">
        <div class="table_wrapper" >
          <table >
            <tr>
              <th>Image</th>
              <th>Time</th>
              <th>File name</th>
              <th
                v-for="header in table_headers"
                :key="`header_${header}`">
                <div class="nonstandard_proprety">
                  {{header}}
                </div>

              </th>
            </tr>

            <tr
              class="doc"
              v-for="doc in collection"
              :key="doc._id"
              @click="$router.push({path: `/${collection_name}/${doc._id}`})">


              <td>
                <img :src="`${api_url}/collections/${collection_name}/images/${doc._id}/image`">
              </td>
              <td>
                <div class="nowrap">
                  {{format_date(doc.time)}}
                </div>
              </td>
              <td>
                <div class="nowrap">
                  {{doc.image}}
                </div>
              </td>

              <td
                v-for="key in table_headers"
                :key="`${doc._id}_${key}`">
                <div class="nonstandard_proprety">
                  {{property_formatting(doc[key])}}
                </div>

              </td>
            </tr>
          </table>

        </div>



        <div
          v-if="!all_loaded && !loading"
          class="load_more_container">
          <button type="button" @click="get_list()">Load more</button>
        </div>

      </template>

      <div
        class="loader_container"
        v-if="loading">
        <Loader />
      </div>


      <div class="" v-if="!loading && !error && collection.length === 0">
        No data
      </div>
    </template>





  </div>
</template>

<script>
// @ is an alias to /src
import Loader from '@moreillon/vue_loader'
//import XLSX from 'xlsx'

import DeleteIcon from 'vue-material-design-icons/Delete.vue'
import DatabaseExportIcon from 'vue-material-design-icons/DatabaseExport.vue'
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'


export default {
  name: 'List',
  components: {
    Loader,
    DeleteIcon,
    DatabaseExportIcon,
    MagnifyIcon,
  },
  data(){
    return {
      search_query: null,
      loading: false,
      error: null,
      collection: [],
      api_url: process.env.VUE_APP_STORAGE_SERVICE_API_URL,
      batch_size: 100,
      all_loaded: false,
      count: 0,
      table_headers: [],
    }
  },
  mounted(){
    this.get_db_document_count()
    this.clear_list()
    this.get_list()
  },
  beforeRouteUpdate (to, from, next) {
    this.get_db_document_count()
    this.clear_list()
    this.get_list()
    next()
  },

  methods: {
    clear_list(){
      this.collection.splice(0,this.collection.length)
      this.all_loaded = false
    },
    get_db_document_count(){
      const url = `${this.api_url}/collections/${this.collection_name}`
      this.axios.get(url)
      .then(response => {
        this.count = response.data.documents
      })
      .catch(error =>{
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
    },
    get_list(){
      this.loading = true
      const url = `${this.api_url}/collections/${this.collection_name}/images`

      let params = {
        start_index: this.collection.length,
        batch_size: this.batch_size,
      }

      if(this.search_query) params.filter = this.search_query

      this.axios.get(url, {params})
      .then(response => {

        response.data.forEach((doc) => {
          this.collection.push(doc)

          const ignored_headers = ['_id', 'time', 'image', 'image_url']
          for (var key in doc) {
            if(!this.table_headers.includes(key) && !ignored_headers.includes(key)) {
              this.table_headers.push(key)
            }
          }
        })

        if(response.data.length < this.batch_size) this.all_loaded = true
      })
      .catch(error =>{
        this.error = true
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
      .finally(()=>{this.loading = false})
    },
    search(){
      this.clear_list()
      this.get_list()
    },
    export_collection(){
      window.location.href=`${this.api_url}/collections/${this.collection_name}/export`
    },
    drop_collection(){
      if(!confirm('ホンマに？')) return
      this.axios.delete(`${this.api_url}/collections/${this.collection_name}`)
      .then(() => {
        this.$router.push({name: 'home'})
      })
      .catch(error =>{
        alert(error)
      })
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
    property_formatting(property){
      if(['string', 'number', 'boolean'].includes(typeof(property))) return property
      else return typeof(property)
    }
  },
  computed: {
    collection_name(){
      return this.$route.params.collection
    },
    search_valid(){
      if(!this.search_query) return true
      try {
        JSON.parse(this.search_query)
      } catch (e) {
        return false
      }

      return true
    }
  }
}
</script>

<style scoped>

.table_wrapper {
  width: 100%;
  overflow-x: auto;
}
table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
}
td, th {
  padding: 0.25em 0.5em;
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

td {
  white-space: nowrap;
}

.doc img {
  width: 5em;
}

.buttons_wrapper {
  margin: 1em 0;
  display: flex;
  align-items: center;
}

.spacer {
  flex-grow: 1;
}

.buttons_wrapper > *:not(:last-child) {
  margin-right: 1em;
}

.buttons_wrapper input[type="text"] {
  padding: 0.25em;
  flex-grow: 1;
}

.nonstandard_proprety {
  max-width: 8em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.load_more_container{
  margin-top: 1em;
  text-align: center;
}
</style>
