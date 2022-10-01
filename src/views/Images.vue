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

      <v-row>
        <v-col cols="auto">
          <DatePicker label="From" v-model="from"/>
        </v-col>
        <v-col cols="auto">
          <DatePicker label="To" v-model="to"/>
        </v-col>
      </v-row>


    </v-container>
    <v-divider />

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
import DatePicker from '../components/DatePicker.vue'

export default {
  name: 'Images',
  components: {
    UploadDialog,
    DatePicker
  },
  data(){
    return {
      loading: false,
      base_headers: [
        {text: 'Image', value: 'file'},
        {text: 'Time', value: 'time'}
      ],
      extra_headers: [],
      items: [],
      total: 0,
      options: {
        sortBy: ['time'],
        sortDesc: [true],
      },
    }
  },
  mounted(){
    this.get_items()
    this.get_fields()
  },
  watch: {
    options: {
      handler () {
        this.get_items()
      },
      deep: true,
    },
    query(){
      this.get_items()
    }
  },
  methods:{
    get_items(){
      this.loading = true
      this.items = []

      const { itemsPerPage, page, sortBy, sortDesc} = this.options

      const params = {
        limit: itemsPerPage,
        skip: ( page - 1 ) * itemsPerPage,
        sort: sortBy[0],
        order: sortDesc[0] ? -1 : 1,
        ...this.query
      }

      this.axios.get('/images', { params })
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
          this.extra_headers = data.map(f => ({ text: f, value: `data.${f}` }))
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
        ...this.extra_headers,
      ]
    },
    query(){
      return this.$route.query
    },
    // TODO: find way to generate those programatically
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
