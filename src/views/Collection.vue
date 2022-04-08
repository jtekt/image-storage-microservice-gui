<template>
  <v-card>

    <v-toolbar
      flat
      extended
      extension-height="64">
      <v-row align="center">
        <v-col>
          <BreadCrumbs />
        </v-col>
        <v-spacer/>
        <v-col cols="auto">
          <v-btn
            @click="export_collection()">
            <v-icon>mdi-download</v-icon>
            <span class='ml-2'>Export</span>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            dark
            color="#c00000"
            @click="drop_collection()">
            <v-icon>mdi-delete</v-icon>
            <span>Delete</span>
          </v-btn>
        </v-col>
      </v-row>





      <template v-slot:extension>
        <v-form @submit.prevent="get_items()" style="width:100%;">

          <v-container fluid>
            <v-row align="baseline">
              <v-col>
                <v-select
                  label="key"
                  v-model="filter_key"
                  :items="headers.map(h => h.value)">
                </v-select>
              </v-col>
              <v-col>
                <v-text-field
                  label="value"
                  v-model="filter_property" />
              </v-col>


              <v-col>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="dates"
                  transition="scale-transition"
                  offset-y
                  min-width="auto" >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      label="Date range"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"/>
                  </template>
                  <v-date-picker
                    v-model="dates"
                    range
                    no-title
                    scrollable >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="clear_dates()">
                      Clear
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="select_dates()">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="auto">
                <v-btn
                  type="submit">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>


    </v-toolbar>
    <v-divider></v-divider>


    <v-card-text>



      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="item_count"
        @click:row="$router.push({name: 'item', params: {item_id: $event._id}})">


        <!-- Thumbnails -->
        <template v-slot:item.image="{ item }">
          <v-img
            contain
            max-height="100"
            max-width="100"
            :src="`${api_url}/collections/${collection_name}/images/${item._id}/image`"
            alt="item"/>
        </template>

        <!-- Date -->
        <template v-slot:item.time="{ item }">

          <span>{{format_date(item.time)}}</span>

        </template>



      </v-data-table>

    </v-card-text>



  </v-card>
</template>

<script>
import BreadCrumbs from '@/components/BreadCrumbs.vue'

export default {
  name: 'Collection',

  components: {
    BreadCrumbs
  },
  data(){
    return {
      items: [],
      item_count: 0,
      options: {
        sortBy: ['time'],
        sortDesc: [false]
      },
      loading: false,
      headers: [
        {text: 'Image', value: "image"},
        {text: 'Time', value: "time"},
      ],
      api_url: process.env.VUE_APP_STORAGE_SERVICE_API_URL,
      dates: [],
      menu: false,
      filter_key: null,
      filter_property: null,
    }
  },
  mounted(){
    this.get_items()
    this.get_item_count()
  },
  watch: {
    options: {
      handler () {
        this.get_items()
      },
      deep: true,
    },
  },
  methods: {
    get_items(){
      this.loading = true
      this.items = []
      const url = `${this.api_url}/collections/${this.collection_name}/images`
      const { page, itemsPerPage, sortBy, sortDesc } = this.options

      const sort = sortBy.reduce((acc, item, index) => {
        acc[item] = sortDesc[index] ? 1 : -1
        return acc
      }, {})


      const params = {
        start_index: (page-1) * itemsPerPage,
        limit: itemsPerPage === -1 ? 0 : itemsPerPage,
        sort,
        filter: {}
      }

      if(this.dates.length > 0) {
        params.filter.time = {}
        if(this.dates[0]) params.filter.time['$gte'] = this.dates[0]
        if(this.dates[1]) params.filter.time['$lt'] = this.dates[1]
      }

      if(this.filter_property && this.filter_key) {
        params.filter[this.filter_key] = this.filter_property
      }



      this.axios.get(url, {params})
      .then(({data}) => {
        this.items = data
        this.build_headers(this.items)


      })
      .catch((error) => {
        console.error(error)
        alert(error)
      })
      .finally(() => {this.loading = false})
    },

    format_date(raw_date){
      const date = new Date(raw_date)
      const date_formatted =  date.toLocaleString('ja-JP')
      return date_formatted
    },

    export_collection(){
      window.location.href=`${this.api_url}/collections/${this.collection_name}/export`
    },

    drop_collection(){

      const confirm_message = `Delete collection ${this.collection_name}?\nすべてのデータが消えます．よろしいですか？\n個々のデータを消す場合には，個々のデータを選択してOKして下さい．`

      if(!confirm(confirm_message)) return
      this.axios.delete(`${this.api_url}/collections/${this.collection_name}`)
      .then(() => { this.$router.push({name: 'collections'}) })
      .catch(error =>{
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
    },

    get_item_count(){
      const url = `${this.api_url}/collections/${this.collection_name}`
      this.axios.get(url)
      .then(({data}) => { this.item_count = data.documents })
      .catch(error =>{
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
    },
    
    build_headers(items){
      items.forEach((item) => {
        for (let key in item) {
          const header_exists = this.headers.some(header => header.value === key)
          if(!header_exists) this.headers.push({text: key, value: key})
        }
      })
    },
    clear_dates(){
      this.dates = []
      //this.menu = false
      this.get_items()
      this.$refs.menu.save(this.dates)
    },
    select_dates(){
      //this.menu = false
      this.get_items()
      this.$refs.menu.save(this.dates)
    },
  },
  computed: {
    collection_name(){
      return this.$route.params.collection_name
    },
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  }

}
</script>

<style>
td, th {
  white-space: nowrap;
}
</style>
