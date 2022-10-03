<template>
  <v-card>

    <v-container fluid>
      <v-row>
        <v-col>
          <v-toolbar-title>Images</v-toolbar-title>
        </v-col>
        <v-spacer />

        <v-col cols="auto">
          <UploadDialog />
        </v-col>

        <v-col cols="auto">
          <v-btn text @click="export_collection()">
            <v-icon>mdi-download</v-icon>
            <span class='ml-2'>Export</span>
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn text :to="{name: 'import'}">
            <v-icon>mdi-upload</v-icon>
            <span class='ml-2'>Import</span>
          </v-btn>
        </v-col>
      </v-row>

      <QuerySettings :fields="fields" />

      
    </v-container>

    <v-card-text>
      <v-data-table :loading="loading" :headers="headers" :items="items" :server-items-length="total"
        :options.sync="options" @click:row="row_clicked($event)">

        <template v-slot:item.file="{ item }">
          <img class="thumbnail" :src="image_src(item)" />
        </template>

        <template v-slot:item.time="{ item }">
          <span>{{format_date(item.time)}}</span>
        </template>

      </v-data-table>
    </v-card-text>

  </v-card>

</template>

<script>
import UploadDialog from '../components/UploadDialog.vue'
import QuerySettings from '../components/QuerySettings.vue'

export default {
  name: 'Images',
  components: {
    UploadDialog,
    QuerySettings
  },
  data(){
    return {
      loading: false,
      fields: [],
      field: null,
      base_headers: [
        {text: 'Image', value: 'file'},
        {text: 'Time', value: 'time'}
      ],
      extra_headers: [],
      items: [],
      total: 0,
    }
  },
  mounted(){
    this.get_items()
    this.get_fields()
  },
  watch: {
    query(){
      this.get_items()
    }
  },
  methods:{
    get_items(){
      this.loading = true
      this.items = []

      const params = this.query

      this.axios.get('/images', {params})
      .then( ({data}) => {
        this.items = data.items
        this.total = data.total
       })
      .catch( (error) => {
        alert('Failed to query data')
        console.error(error)
      })
      .finally(() => {
        this.loading = false
      })
    },
    get_fields(){
      this.axios.get('/fields')
        .then(({ data }) => {
          this.fields = data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    row_clicked({_id}) {
      this.$router.push({name: 'image', params: {_id}})
    },
    format_date(time){
      const date = new Date(time)
      return date.toLocaleString()
    },
    image_src({_id}){
      return `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images/${_id}/image`
    },
    export_collection(){
      const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/export`
      window.open(url, '_blank')
    },

  },
  computed:{
    headers(){
      return [
        ...this.base_headers,
        ...this.fields.map(f => ({ text: f, value: `data.${f}` })),
      ]
    },
    query(){
      return this.$route.query
    },
    to: {
      get() {
        return this.$route.query.to
      },
      set(newVal) {
        const query = { ...this.$route.query, to: newVal }
        if (!newVal) delete query.to
        this.$router.push({ query })
      }
    },
    from: {
      get() {
        return this.$route.query.from
      },
      set(newVal) {
        const query = { ...this.$route.query, from: newVal }
        if (!newVal) delete query.from
        this.$router.push({ query })
      }
    },
    options: {
      get(){

        // Defaults are not loaded properly
        const {
          limit = 5,
          sort = 'time',
          order = -1,
          skip = 0,
        } = this.$route.query

        return {
          itemsPerPage: Number(limit),
          sortBy: [sort],
          sortDesc: [order === '-1'],
          page: (skip / limit) + 1
        }
      },
      set(newVal){

        const { itemsPerPage, page, sortBy, sortDesc } = newVal

        const params = {
          limit: String(itemsPerPage),
          skip: String((page - 1) * itemsPerPage),
          sort: String(sortBy[0]),
          order: String(sortDesc[0] ? -1 : 1),
        }

        const query = { ...this.$route.query, ...params }

        // Stringify is dirty
        if(JSON.stringify(this.$route.query) !== JSON.stringify(query)) this.$router.push({ query })
      }
    }
  }

}
</script>

<style>
.thumbnail{
  height: 5em;
  width: 5em;
}
td, th {
  white-space: nowrap;
}
</style>
