<template>
    <v-container>
        <v-row class="mb-2">
            <v-col cols="auto">
                <v-btn
                    color="primary"
                    :disabled="!isJsonValid"
                    @click="beautifyJson"
                >
                    Beautify
                </v-btn>
            </v-col>
            <v-col cols="auto">
                <v-select
                    v-model="indentSpaces"
                    :items="[2, 4, 8]"
                    label="Indent Spaces"
                    solo
                    dense
                    hide-details
                    style="width: 80px"
                    :disabled="!isJsonValid"
                    @change="beautifyJson"
                ></v-select>
            </v-col>
        </v-row>
        <v-textarea
            v-model="jsonString"
            outlined
            label="Advanced Query"
            rows="10"
            auto-grow
            hide-details
            class="json-editor"
        >
        </v-textarea>
        <div
            v-for="(error, index) in errors"
            :key="index"
            class="red--text text--lighten-1"
        >
            {{ error }}
        </div>
    </v-container>
</template>

<script>
export default {
    name: 'QueryEditor',
    props: {
        value: {
            type: [Object, String],
            default: () => ({
                data: {},
            }),
        },
        errors: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            indentSpaces: 4,
        }
    },
    computed: {
        jsonString: {
            get() {
                if (typeof this.value === 'object' && this.value !== null) {
                    return JSON.stringify(this.value, null, this.indentSpaces)
                }
                return (
                    this.value ||
                    JSON.stringify({ data: {} }, null, this.indentSpaces)
                )
            },
            set(newValue) {
                this.$emit('input', newValue)
            },
        },
        isJsonValid() {
            try {
                JSON.parse(this.jsonString)
                return true
            } catch {
                return false
            }
        },
    },
    methods: {
        beautifyJson() {
            try {
                let parsed = JSON.parse(this.jsonString)
                this.jsonString = JSON.stringify(
                    parsed,
                    null,
                    this.indentSpaces
                )
                this.errorMessages = []
            } catch (error) {
                this.errorMessages = ['Invalid JSON: ' + error.message]
            }
        },
    },
}
</script>

<style scoped>
.json-editor {
    font-family: 'Courier New', Courier, monospace;
}
</style>
