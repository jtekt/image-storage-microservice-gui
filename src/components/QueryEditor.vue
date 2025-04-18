<template>
    <v-row>
        <v-col>
            <v-textarea
                v-model="localQuery"
                label="MongoDB Query (JSON)"
                outlined
                :rules="jsonRules"
                placeholder='{ "file": "example.jpg" }'
                rows="4"
                @input="updateQuery"
            />
            <v-btn
                color="secondary"
                @click="beautifyQuery"
                :disabled="!isValidJson"
                class="mb-2"
            >
                <v-icon left>mdi-format-align-justify</v-icon>
                Beautify
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'RawQueryEditor',
    props: {
        value: {
            type: String,
            default: '{}',
        },
    },
    data() {
        return {
            localQuery: this.value,
            jsonRules: [
                (v) => !!v || 'Query is required',
                (v) =>
                    this.validateMongoQuery(v) ||
                    'Invalid MongoDB query format. Only "file", "time", and "data" fields are allowed.',
            ],
            validFields: ['file', 'time', 'data'],
        }
    },
    computed: {
        isValidJson() {
            try {
                JSON.parse(this.localQuery)
                return true
            } catch {
                return false
            }
        },
    },
    methods: {
        updateQuery() {
            this.$emit('input', this.localQuery)
        },
        beautifyQuery() {
            try {
                const parsed = JSON.parse(this.localQuery)
                this.localQuery = JSON.stringify(parsed, null, 4)
                this.updateQuery()
            } catch (e) {
                // Silently fail if already validated
            }
        },
        validateMongoQuery(value) {
            const validTopLevelFields = ['file', 'time', '_id', 'data']
            try {
                if (!value) return false
                const parsed = JSON.parse(value)

                // Allow empty query
                if (Object.keys(parsed).length === 0) return true

                return Object.keys(parsed).every((key) => {
                    // Split key to handle data.* notation
                    const [baseKey, ...subKeys] = key.split('.')

                    // Check if base key is valid
                    if (!validTopLevelFields.includes(baseKey)) return false

                    // If it's not 'data' and has subkeys, it's invalid (only one level allowed)
                    if (baseKey !== 'data' && subKeys.length > 0) return false

                    const value = parsed[key]

                    // For file and time, must be string if not an object
                    if (baseKey === 'file' || baseKey === 'time') {
                        if (typeof value !== 'object')
                            return typeof value === 'string'
                    }

                    // If value is an object (operators), check for valid MongoDB operators
                    if (typeof value === 'object' && value !== null) {
                        return Object.keys(value).every(
                            (op) => op.startsWith('$') || op === '_id'
                        )
                    }

                    // For data.* fields, any value is allowed
                    return true
                })
            } catch (e) {
                return false
            }
        },
    },
    watch: {
        value(newVal) {
            this.localQuery = newVal
        },
    },
}
</script>
