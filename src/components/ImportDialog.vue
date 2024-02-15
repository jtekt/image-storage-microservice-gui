<template>
    <v-dialog v-model="dialog" width="40rem">
        <template v-slot:activator="{ on, attrs }">
            <v-btn block text v-bind="attrs" v-on="on">
                <v-icon left>mdi-upload</v-icon>
                <span>Import</span>
            </v-btn>

            <!-- Snackbar does not render well because inside a menu -->
            <!-- <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.text }}
          
            <template v-slot:action="{ attrs }">
              <v-btn dark text v-bind="attrs" @click="snackbar.show = false">
                Close
              </v-btn>
            </template>
          </v-snackbar> -->
        </template>

        <v-card>
            <v-card-title>Import</v-card-title>

            <v-form @submit.prevent="import_archive()">
                <v-card-text>
                    <v-file-input
                        accept=".zip"
                        label="Archive (.zip)"
                        v-model="archive"
                    />
                    <ImageDataEditor
                        title="Fields"
                        :textarea_row="5"
                        :json="fields"
                        @save-data="fields = $event"
                    />
                </v-card-text>
                <v-card-text>
                    <v-progress-linear
                        height="25"
                        :value="this.uploadProgress"
                        rounded
                    >
                        {{ this.uploadProgress }}%
                    </v-progress-linear>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text @click="dialog = false">
                        <v-icon left>mdi-close</v-icon>
                        <span>close</span>
                    </v-btn>

                    <v-btn
                        text
                        type="submit"
                        :loading="uploading"
                        :disabled="!archive"
                    >
                        <v-icon left>mdi-upload</v-icon>
                        <span>Import</span>
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import ImageDataEditor from './ImageDataEditor.vue'
export default {
    name: 'ImportDialog',
    components: {
        ImageDataEditor,
    },
    data() {
        return {
            dialog: false,
            uploading: false,
            uploadProgress: 0,
            archive: null,
            fields: {},

            // TODO: find way to get snackbar to work
            snackbar: {
                show: false,
                text: '',
                color: 'sucess',
            },
        }
    },
    methods: {
        import_archive() {
            this.uploading = true
            this.uploadProgress = 0

            const body = new FormData()

            body.append('archive', this.archive)
            Object.entries(this.fields).forEach(([key, value]) => {
                body.append(key, value)
            })

            // console.log(this.fields)
            // for (var pair of body.entries()) {
            //     console.log(pair[0] + ', ' + pair[1])
            // }

            const options = {
                onUploadProgress: (progressEvent) => {
                    this.uploadProgress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                },
                headers: { 'Content-Type': 'multipart/form-data' },
            }

            this.axios
                .post('/import', body, options)
                .then(() => {
                    this.$emit('import')
                    this.archive = null
                    this.dialog = false
                    // TODO: try to have something better than alert
                    // this.snackbar.show = true
                    // this.snackbar.color = 'success'
                    // this.snackbar.text = 'Imported successful'
                    alert('Import successful')
                })
                .catch((error) => {
                    if (error.response) console.log(error.response.data)
                    else console.log(error)
                    // TODO: try to have something better than alert
                    // this.snackbar.show = true
                    // this.snackbar.color = 'error'
                    // this.snackbar.text = 'Import failed'
                    alert('Import failed')
                })
                .finally(() => {
                    this.uploading = false
                    this.uploadProgress = 0
                })
        },
    },
}
</script>
