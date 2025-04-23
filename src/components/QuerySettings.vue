<template>
    <v-row dense>
        <v-col>
            <v-card outlined>
                <v-expansion-panels v-model="panel" flat>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <span>
                                <v-icon left>mdi-magnify</v-icon>
                                <span>{{ $t('Query settings') }}</span>
                            </span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-form @submit.prevent="applyFilters()">
                                <v-row align="baseline">
                                    <v-col cols="">
                                        <DatePicker
                                            label="From"
                                            v-model="from"
                                        />
                                    </v-col>
                                    <v-col cols="">
                                        <DatePicker label="To" v-model="to" />
                                    </v-col>
                                </v-row>

                                <v-row v-if="!advancedMode">
                                    <v-col>
                                        <v-row
                                            v-for="(_, index) of filtersArray"
                                            :key="index"
                                            align="center"
                                        >
                                            <v-col cols="5">
                                                <v-combobox
                                                    :items="unusedFilters"
                                                    v-model="
                                                        filtersArray[index].key
                                                    "
                                                    label="Field"
                                                    :rules="[
                                                        (v) =>
                                                            !!v ||
                                                            'Field is required',
                                                    ]"
                                                />
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field
                                                    v-model="
                                                        filtersArray[index]
                                                            .value
                                                    "
                                                    label="Value"
                                                    :rules="[
                                                        (v) =>
                                                            !!v ||
                                                            'Value is required',
                                                    ]"
                                                />
                                            </v-col>
                                            <v-col cols="1">
                                                <v-btn
                                                    @click="removeFilter(index)"
                                                    icon
                                                >
                                                    <v-icon>mdi-close</v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>

                                        <v-row>
                                            <v-col cols="auto">
                                                <v-btn
                                                    color="primary"
                                                    @click="addFilter()"
                                                >
                                                    <v-icon left
                                                        >mdi-plus</v-icon
                                                    >
                                                    {{ $t('Add filter') }}
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <v-row v-if="advancedMode">
                                    <v-col>
                                        <QueryEditor
                                            v-model="rawQuery"
                                            :errors="validQuery.errors"
                                        />
                                    </v-col>
                                </v-row>

                                <v-row align="baseline">
                                    <v-col cols="auto">
                                        <v-switch
                                            v-if="!advancedMode"
                                            label="Partial match"
                                            v-model="regex"
                                        />
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-switch
                                            label="Advanced mode"
                                            v-model="advancedMode"
                                        />
                                    </v-col>
                                    <v-spacer />
                                    <v-col cols="auto">
                                        <v-btn
                                            color="primary"
                                            type="submit"
                                            :loading="loading"
                                        >
                                            <v-icon left>mdi-magnify</v-icon>
                                            {{ $t('Apply filters') }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import DatePicker from '../components/DatePicker.vue'
import { validateMongooseQuery } from '../lib/mongoose'
import QueryEditor from './QueryEditor.vue'

export default {
    name: 'QuerySettings',
    components: {
        DatePicker,
        QueryEditor,
    },
    props: {
        fields: Array,
        loading: { type: Boolean, default: false },
    },
    data() {
        return {
            panel: 0,
            filtersArray: [],
            advancedMode: false,
            rawQuery: `{
    "data": {
        "$exists": true
    }
}`,
            validQuery: { success: true, errors: [] },
        }
    },
    mounted() {
        this.loadFiltersFromQuery()
    },
    methods: {
        addFilter() {
            this.filtersArray.push({ key: '', value: '' })
        },
        removeFilter(index) {
            this.filtersArray.splice(index, 1)
        },
        loadFiltersFromQuery() {
            const query = { ...this.$route.query }
            delete query.to
            delete query.from
            delete query.sort
            delete query.order
            delete query.page
            delete query.limit
            delete query.skip
            delete query.regex

            const { filter, ...filters } = query

            if (filter) {
                this.advancedMode = true
                this.rawQuery = filter
            } else {
                this.filtersArray = Object.keys(filters).map((key) => ({
                    key,
                    value: filters[key],
                }))
            }
        },
        applyFilters() {
            const { limit, skip, order, sort } = this.$route.query
            let query = { limit, skip, order, sort }

            if (this.advancedMode) {
                if (!this.validQuery.success)
                    alert(this.validQuery.errors.join(', '))

                query = {
                    ...query,
                    to: this.to,
                    from: this.from,
                    filter: this.rawQuery,
                }
            } else {
                const filters = this.filtersArray.reduce(
                    (prev, { key, value }) => ({ ...prev, [key]: value }),
                    {}
                )
                query = {
                    ...query,
                    to: this.to,
                    from: this.from,
                    regex: this.regex,
                    ...filters,
                }
            }

            if (!this.shallowCompare(query, this.$route.query)) {
                this.$router.replace({ query })
            }
        },
        shallowCompare(obj1, obj2) {
            return (
                Object.keys(obj1).length === Object.keys(obj2).length &&
                Object.keys(obj1).every((key) => obj1[key] === obj2[key])
            )
        },
        setQueryParam(key, value) {
            if (this.$route.query[key] === value) return
            const query = { ...this.$route.query }
            if (value) query[key] = value
            else delete query[key]
            this.$router.replace({ query })
        },
        validateMongooseQuery,
    },
    computed: {
        allFilters() {
            return ['file', 'time', 'data', ...this.fields]
        },
        unusedFilters() {
            return this.allFilters.filter(
                (f) => !this.filtersArray.map(({ key }) => key).includes(f)
            )
        },
        to: {
            get() {
                return this.$route.query.to
            },
            set(newVal) {
                this.setQueryParam('to', newVal)
            },
        },
        from: {
            get() {
                return this.$route.query.from
            },
            set(newVal) {
                this.setQueryParam('from', newVal)
            },
        },
        regex: {
            get() {
                return this.$route.query.regex
            },
            set(newVal) {
                this.setQueryParam('regex', newVal)
            },
        },
    },
    watch: {
        advancedMode(newVal) {
            if (newVal && !this.rawQuery) {
                this.rawQuery = '{}'
            }
        },
        rawQuery(newVal) {
            if (!this.advancedMode) return (this.validQuery = { success: true })

            try {
                const parsedQuery = JSON.parse(newVal)

                if (typeof parsedQuery !== 'object')
                    throw new Error('Query is not an object')

                this.validQuery = validateMongooseQuery(parsedQuery)
            } catch (error) {
                this.validQuery = {
                    success: false,
                    errors: [`Invalid JSON: ${error.message}`],
                }
            }
        },
    },
}
</script>
