<template>
  <v-dialog
    v-model="dialog"
    width="30rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        v-bind="attrs"
        v-on="on">
        <v-icon left>mdi-upload</v-icon>
        <span>Import</span>
      </v-btn>
    </template>

    <v-card>

      <v-card-title>Import</v-card-title>

      <v-form @submit.prevent="import_archive()">
      <v-card-text>
        <v-file-input accept=".zip" label="Archive (.zip)" v-model="archive" />
      
          
          
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>

              <v-btn text @click="dialog = false">
                <v-icon left>mdi-close</v-icon>
                <span>close</span>
              </v-btn>

              <v-btn text type="submit" :loading="uploading" :disabled="!archive">
                <v-icon left>mdi-upload</v-icon>
                <span>Import</span>
              </v-btn>

          
          
        </v-card-actions>
      </v-form>
      


    </v-card>
    
  </v-dialog>
</template>

<script>
  export default {
    name: 'ImportDialog',
    data(){
      return {
        dialog: false,
        uploading: false,
        archive: null,
      }
    },
    methods: {
      import_archive() {
        this.uploading = true

        const headers = { 'Content-Type': 'multipart/form-data' }
        const body = new FormData()
        body.append('archive', this.archive)

        this.axios.post('/import', body, { headers })
          .then(() => {
            this.$emit('import')

          })
          .catch(error => {
            if (error.response) console.log(error.response.data)
            else console.log(error)
            alert(`Something went wrong`)
          })
          .finally(() => { this.uploading = false })

      }
    }

  }
</script>
