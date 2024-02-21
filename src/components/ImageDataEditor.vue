<template>
    <v-card elevation="0" outlined v-if="json">
        <v-toolbar flat>
            <v-row align="center">
                <v-col>
                    <v-toolbar-title class="font-weight-medium">
                        {{ title }}</v-toolbar-title
                    >
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                    <div v-if="edit_mode">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                    color="error"
                                    @click.stop="cancel_edit()"
                                >
                                    <v-icon> mdi-close-box </v-icon>
                                </v-btn>
                            </template>
                            <div class="text-center">Cancel Changes</div>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                    color="success"
                                    :disabled="
                                        !inputValid || input_type === undefined
                                    "
                                    @click.stop="save_data()"
                                >
                                    <v-icon> mdi-content-save </v-icon>
                                </v-btn>
                            </template>
                            <div class="text-center">Save Changes</div>
                        </v-tooltip>
                    </div>
                    <v-tooltip bottom v-else>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                color="secondary"
                                @click.stop="start_edit()"
                            >
                                <v-icon> mdi-lead-pencil </v-icon>
                            </v-btn>
                        </template>
                        <div class="text-center">Edit image properties</div>
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-toolbar>
        <v-card-text>
            <ImageDataField
                v-if="edit_mode"
                v-model="data_string"
                @valid-input="inputValid = $event"
                @input-type="input_type = $event"
            />
            <v-list v-else>
                <v-list-item v-for="(value, key) in json" :key="key">
                    <v-list-item-content>
                        <v-list-item-subtitle class="font-weight-medium">{{
                            key
                        }}</v-list-item-subtitle>
                        <v-list-item-title>
                            <pre>{{ format_metadata(value) }}</pre>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
import yaml from 'js-yaml'
import ImageDataField from './ImageDataField.vue'

export default {
    name: 'ImageDataEditor',
    components: {
        ImageDataField,
    },
    data() {
        return {
            edit_mode: false,
            data_string: '',
            input_type: 'JSON',
            inputValid: true,
        }
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        json: {
            type: Object,
            default: null,
        },
        textarea_row: {
            type: Number,
            default: 10,
        },
    },
    methods: {
        format_metadata(data) {
            try {
                return JSON.stringify(data, null, 2)
            } catch (error) {
                return data
            }
        },
        save_data() {
            if (!this.inputValid) return
            if (!confirm('Save changes?')) return
            this.$emit('save-data', this.json_value)
            this.reset_changes()
        },
        start_edit() {
            this.edit_mode = true
            if (this.json) this.data_string = this.format_metadata(this.json)
        },
        cancel_edit() {
            if (!confirm('Abandon changes?')) return
            this.reset_changes()
        },
        reset_changes() {
            this.edit_mode = false
            this.data_string = ''
        },
    },
    computed: {
        json_value() {
            if (this.input_type === 'JSON') {
                return JSON.parse(this.data_string)
            } else if (this.input_type === 'YAML') {
                return yaml.load(this.data_string)
            }
            return null
        },
    },
}
</script>
