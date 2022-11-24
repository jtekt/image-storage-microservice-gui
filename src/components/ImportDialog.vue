<template>
  <v-dialog
    v-model="dialog"
    width="40rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        v-bind="attrs"
        v-on="on">
        <v-icon left>mdi-upload</v-icon>
        <span>Import</span>
      </v-btn>

      <v-snackbar :color="snackbar.color" v-model="snackbar.show">
        {{ snackbar.text }}
      
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="snackbar.show = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      
    </template>

    <v-card>

      <v-card-title>Import</v-card-title>

      <v-form @submit.prevent="import_archive()">
      <v-card-text>
        <v-file-input accept=".zip" label="Archive (.zip)" v-model="archive" />

        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Add fields
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row v-for="(field, index) in fields" :key="index" align="baseline">
                <v-col>
                  <v-text-field
                    label="Field"
                    v-model="field.key" />
                </v-col>
                <v-col>
                  <v-text-field label="Value" v-model="field.value"/>
                </v-col>
                <v-col cols="auto">
                  <v-btn icon @click="deleteField(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="auto">
                  <v-btn text @click="addField()">
                    <v-icon left>mdi-plus</v-icon>
                    <span>Add field</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      
          
          
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
        fields: [],

        snackbar: {
          show: false,
          text: '',
          color: 'sucess'
        },

      }
    },
    methods: {
      import_archive() {
        this.uploading = true

        const headers = { 'Content-Type': 'multipart/form-data' }
        const body = new FormData()

        body.append('archive', this.archive)

        this.fields.forEach(field => {
          body.append(field.key, field.value)
        })

        this.axios.post('/import', body, { headers })
          .then(() => {
            this.$emit('import')
            this.archive = null
            this.dialog = false
            this.snackbar.show = true
            this.snackbar.color = 'success'
            this.snackbar.text = 'Imported successful'
          })
          .catch(error => {
            if (error.response) console.log(error.response.data)
            else console.log(error)
            this.snackbar.show = true
            this.snackbar.color = 'error'
            this.snackbar.text = 'Import failed'
          })
          .finally(() => { this.uploading = false })

      },

      addField(){
        this.fields.push({key: '', value: ''})
      },
      deleteField(index) {
        this.fields.splice(index,1)
      }
    }

  }
</script>
