<template>
    <div>
        <v-row>
            <v-col>
                <v-chip-group
                    active-class="primary--text"
                    v-model="selected_type"
                    column
                >
                    <v-chip
                        key="JSON"
                        value="JSON"
                        :disabled="!valid_input && selected_type !== undefined"
                    >
                        JSON
                    </v-chip>
                    <v-chip
                        key="YAML"
                        value="YAML"
                        :disabled="!valid_input && selected_type !== undefined"
                    >
                        YAML
                    </v-chip>
                </v-chip-group>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-textarea
                    filled
                    :class="auto_grow ? 'field-compose-input' : ''"
                    :rows="textarea_row"
                    :row-height="20"
                    v-model="data_string"
                    no-resize
                    :auto-grow="auto_grow"
                    :error="!valid_input"
                    :error-messages="error_message"
                />
            </v-col>
        </v-row>
    </div>
</template>
<script>
import yaml from 'js-yaml'

export default {
    name: 'ImageDataEditor',
    data() {
        return { data_string: this.value, selected_type: 'JSON' }
    },
    props: {
        value: String,
        textarea_row: {
            type: Number,
            default: 10,
        },
        auto_grow: {
            type: Boolean,
            default: true,
        },
    },
    watch: {
        data_string(newVal) {
            if (newVal.trim() === '' && this.selected_type === 'JSON')
                this.data_string = '{}'
            this.$emit('input', this.data_string)
        },
        selected_type(newVal) {
            if (newVal === 'JSON') {
                this.convert_to_json()
            } else if (newVal === 'YAML') {
                this.convert_to_yaml()
            }
            this.$emit('input-type', newVal)
        },
    },
    computed: {
        valid_input() {
            if (this.selected_type === 'JSON') {
                let is_valid = this.is_valid_json
                this.$emit('valid-input', is_valid)
                return is_valid
            } else if (this.selected_type === 'YAML') {
                let is_valid = this.is_valid_yaml
                this.$emit('valid-input', is_valid)
                return is_valid
            }
            return false
        },
        is_valid_json() {
            try {
                JSON.parse(this.data_string)
            } catch (e) {
                return false
            }
            return true
        },
        is_valid_yaml() {
            try {
                yaml.load(this.data_string)
                return true
            } catch (e) {
                return false
            }
        },
        error_message() {
            if (this.selected_type === undefined)
                return 'Please select JSON or YAML'
            else return !this.valid_input ? `Invalid ${this.selected_type}` : ''
        },
    },
    methods: {
        convert_to_json() {
            if (!this.is_valid_yaml) return
            const jsonObject = yaml.load(this.data_string)
            this.data_string = JSON.stringify(jsonObject, null, 2)
        },
        convert_to_yaml() {
            if (!this.is_valid_json) return
            const jsonObject2 = JSON.parse(this.data_string)
            this.data_string = yaml.dump(jsonObject2)
        },
    },
}
</script>
<style>
.field-compose-input {
    textarea {
        max-height: 300px !important;
        overflow: auto !important;
    }
}
</style>
