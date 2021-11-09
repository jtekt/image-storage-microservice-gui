<template>

  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Images</v-toolbar-title>
    </v-toolbar>
    <v-divider/>

    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="items"
        @click:row="row_clicked($event)">

        <template v-slot:item.file="{ item }">
          <v-img
            height="5em"
            width="5em"
            :src="image_src(item)"/>
        </template>

        <template v-slot:item.time="{ item }">
          <span>{{format_date(item)}}</span>
        </template>

      </v-data-table>
    </v-card-text>

  </v-card>

</template>

<script>
export default {
  name: 'Images',
  data(){
    return {
      loading: false,
      base_headers: [
        {text: 'Image', value: 'file'},
        {text: 'Time', value: 'time'}
      ],
      extra_headers: [],
      items: []
    }
  },
  mounted(){
    this.get_items()
  },
  methods:{
    get_items(){
      this.loading = true
      this.items = []
      const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images`
      this.axios.get(url)
      .then( ({data}) => {
        this.items = data
        this.build_headers()
       })
      .catch( (error) => {
        alert('Failed to query data')
        console.error(error)
      })
      .finally(() => {
        this.loading = false
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
    build_headers(){
      this.items.forEach((item) => {
        for (let key in item.data) {
          const header_exists = this.extra_headers.some(header => header.value === `data.${key}`)
          if(!header_exists) this.extra_headers.push({text: key, value: `data.${key}`})
        }
      })
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

<style scoped>
</style>
