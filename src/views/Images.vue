<template>

  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Images</v-toolbar-title>
    </v-toolbar>
    <v-divider/>

    <v-card-text>
      <v-data-table
        :headers="headers">
      </v-data-table>
    </v-card-text>

  </v-card>

</template>

<script>
export default {
  name: 'Images',
  data(){
    return {
      headers: [
        {text: 'Time', value: 'time'}
      ]
    }
  }
}
</script>

<style scoped>
</style>
