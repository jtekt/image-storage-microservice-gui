<template>
    <v-dialog v-model="dialog" width="40rem">
        <template v-slot:activator="{ on, attrs }">
            <v-btn block text v-bind="attrs" v-on="on">
                <v-icon left>mdi-lead-pencil</v-icon>
                <span>{{ dialog_label }}</span>
            </v-btn>
        </template>

        <v-card>
            <v-card-title>{{ dialog_label }}</v-card-title>
            <v-card-text>
                <v-card elevation="0">
                    <v-card-title class="font-weight-medium">
                        Fields</v-card-title
                    >
                    <v-card-text>
                        <ImageDataField
                            v-model="data_string"
                            :textarea_row="1"
                            @valid-input="validInput = $event"
                            @input-type="input_type = $event"
                        />
                    </v-card-text>
                </v-card>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text @click.stop="reset_field()">
                    <v-icon left>mdi-close</v-icon>
                    <span>close</span>
                </v-btn>

                <v-btn
                    text
                    :loading="updating"
                    :disabled="!validInput || input_type === undefined"
                    @click.stop="updateFields()"
                >
                    <v-icon left>mdi-lead-pencil</v-icon>
                    <span>Update</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import yaml from 'js-yaml'
import ImageDataField from './ImageDataField.vue'
export default {
    name: 'UpdateDialog',
    components: {
        ImageDataField,
    },
    props: {
        imageCount: Number,
        selected: [],
    },
    data() {
        return {
            dialog: false,
            updating: false,
            data_string: '{}',
            input_type: 'JSON',
            validInput: true,
        }
    },
    computed: {
        query() {
            return this.$route.query
        },
        dialog_label() {
            return this.selected.length === 0
                ? `Update ${this.numberWithCommas(this.imageCount)} images`
                : `Update ${this.numberWithCommas(
                      this.selected.length
                  )} selected image(s)`
        },
        json_value() {
            if (this.input_type === 'JSON') {
                return JSON.parse(this.data_string)
            } else if (this.input_type === 'YAML') {
                return yaml.load(this.data_string)
            }
            return null
        },
    },
    methods: {
        numberWithCommas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
        },
        updateFields() {
            if (!this.validInput) return
            if (!confirm('Save changes?')) return
            const data = this.json_value

            let params = this.query
            if (this.selected.length > 0)
                params = { ...params, ids: this.selected }

            this.updating = true
            this.axios
                .patch('/images', data, { params })
                .then(() => {
                    alert('Update successful')
                    this.reset_field()
                    this.$emit('updated')
                })
                .catch((error) => {
                    if (error.response) console.log(error.response.data)
                    else console.log(error)
                    alert('Update failed')
                })
                .finally(() => {
                    this.updating = false
                })
        },
        reset_field() {
      this.data_string = ""
            this.dialog = false
        },
    },
}
</script>
