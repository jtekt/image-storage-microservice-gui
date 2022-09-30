<template>
  <v-card>

    <v-toolbar flat>
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

      <template v-if="false" v-slot:extension>
        <v-text-field append-icon="mdi-magnify" label="Query" v-model="query" />
      </template>
    </v-toolbar>
    <v-divider />

    <v-card-text>
      <v-data-table :loading="loading" :headers="headers" :items="items" :server-items-length="total"
        :options.sync="options" @click:row="row_clicked($event)">

        <template v-slot:item.file="{ item }">
          <img class="thumbnail" :src="image_src(item)" />
        </template>

        <template v-slot:item.time="{ item }">
          <span>{{format_date(item)}}</span>
        </template>

      </v-data-table>
    </v-card-text>

  </v-card>

</template>

<script>
import UploadDialog from '../components/UploadDialog.vue'
export default {
  name: 'Images',
  components: {
    UploadDialog
  },
  data(){
    return {
      loading: false,
      query: '',
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
      }

      this.axios.get('/images', { params })
      .then( ({data}) => {
        this.items = data.items
        this.total = data.total
        // this.build_headers()
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
      this.axios.get('/images/fields')
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
    format_date({time}){
      const date = new Date(time)
      return date.toLocaleString('Ja-JP')
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
