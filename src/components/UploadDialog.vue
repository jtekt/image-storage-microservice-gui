<template>
  <v-dialog
    v-model="dialog"
    width="30rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        v-bind="attrs"
        v-on="on">
        <v-icon>mdi-image-plus</v-icon>
        <span class='ml-2'>Upload</span>
      </v-btn>
    </template>

    <v-card>

      <v-card-title>
        Upload
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="upload()">
          <v-row
            align="center">
            <v-col>
              <v-file-input
                v-model="image"
                label="Image"/>
            </v-col>
            <v-col cols="auto">
              <v-btn
                :disabled="!image"
                type="submit">
                <v-icon>mdi-image-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      


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
        formData.append("image", this.image)

        this.axios.post(`${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images`, formData)
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
