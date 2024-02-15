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
                    <v-card elevation="0" outlined>
                        <v-card-title class="font-weight-medium">
                            Fields</v-card-title
                        >
                        <v-card-text>
                            <ImageDataField
                                v-model="data_string"
                                :textarea_row="1"
                                :auto_grow="true"
                                @valid-input="validInput = $event"
                            />
                        </v-card-text>
                    </v-card>
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
                        :disabled="!archive || !validInput"
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
import ImageDataField from './ImageDataField.vue'
export default {
    name: 'ImportDialog',
    components: {
        ImageDataField,
    },
    data() {
        return {
            dialog: false,
            uploading: false,
            uploadProgress: 0,
            archive: null,
            data_string: '{}',
            validInput: true,

            // TODO: find way to get snackbar to work
            snackbar: {
                show: false,
                text: '',
                color: 'sucess',
            },
        }
    },
    computed: {
        fields() {
            try {
                return JSON.parse(this.data_string)
            } catch (e) {
                alert('JSON invalid')
            }
            return null
        },
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
