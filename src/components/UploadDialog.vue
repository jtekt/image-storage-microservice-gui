<template>
  <v-dialog
    v-model="dialog"
    width="30rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        block
        text
        v-bind="attrs"
        v-on="on">
        <v-icon left>mdi-image-plus</v-icon>
        <span>Upload</span>
      </v-btn>
    </template>

    <v-card>

      <v-card-title>Upload</v-card-title>

      <v-form @submit.prevent="upload()">
      <v-card-text>
  
              <v-file-input
                v-model="image"
                label="Image"
                accept="image/*"/>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        
          <v-btn text @click="dialog = false">
            <v-icon left>mdi-close</v-icon>
            <span>close</span>
          </v-btn>
        
          <v-btn :loading="uploading" text :disabled="!image" type="submit">
            <v-icon left>mdi-image-plus</v-icon>
            <span>Upload</span>
          </v-btn>
        
        
        
        </v-card-actions>
      </v-form>
      


    </v-card>
    
  </v-dialog>
</template>

<script>
  export default {
    name: 'UploadDialog',
    data(){
      return {
        dialog: false,
        image: null,
        uploading: false
      }
    },
    methods: {
      upload(){
        if(!this.image) return
        this.uploading = true
        const formData = new FormData()
        formData.append('image', this.image)

        this.axios.post('/images', formData)
        .then( ({data: {_id}}) => {
          this.$router.push({name: 'image', params: {_id}})
        })
        .catch(error => {
          alert('Error while importing')
          console.error(error)
        })
        .finally(() => {
          this.uploading = false
        })

      }
    }

  }
</script>
