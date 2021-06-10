<template>
  <v-breadcrumbs :items="breadcrumbs"/>
</template>

<script>
  export default {
    name: 'BreadCrumbs',

    data: () => ({

    }),
    computed: {
      breadcrumbs(){
        let output = [
          {
            text: 'Collections',
            exact: true,
            to: {name: 'collections'},
          },
        ]

        if(!this.$route.params.collection_name) return output

        output.push( {
          text: this.$route.params.collection_name,
          exact: true,
          to: {name: 'collection', params: {collection_name: this.$route.params.collection_name}},
          disabled: false,
        })



        if(!this.$route.params.item_id) return output


        output.push( {
          text: this.$route.params.item_id,
          disabled: true,
        })

        return output
      }
    }
  }
</script>
