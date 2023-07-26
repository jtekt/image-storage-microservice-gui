<template>
  <v-row dense>
    <v-col>
      <v-card outlined>
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span>
                <v-icon left>mdi-magnify</v-icon>
                <span>{{ $t("Query settings") }}</span>
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form @submit.prevent="applyFilters()">
                <v-row align="baseline">
                  <v-col cols="">
                    <DatePicker label="From" v-model="from" />
                  </v-col>
                  <v-col cols="">
                    <DatePicker label="To" v-model="to" />
                  </v-col>
                </v-row>

                <!-- This could be its own component -->
                <v-row
                  v-for="(_, index) of filtersArray"
                  :key="index"
                  align="center"
                >
                  <v-col cols="">
                    <v-combobox
                      :items="unusedFilters"
                      v-model="filtersArray[index].key"
                      label="Field"
                    />
                  </v-col>
                  <v-col cols="">
                    <v-text-field
                      v-model="filtersArray[index].value"
                      label="Value"
                    />
                  </v-col>
                  <v-col cols="auto">
                    <v-btn @click="removeFilter(index)" icon>
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="auto">
                    <v-btn color="primary" @click="addFilter()">
                      <v-icon left>mdi-plus</v-icon>
                      <span>{{ $t("Add filter") }}</span>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row align="baseline">
                  <v-col cols="auto">
                    <v-switch label="Partial match" v-model="regex" />
                  </v-col>
                  <v-spacer />
                  <v-col cols="auto">
                    <v-btn color="primary" type="submit" :loading="loading">
                      <v-icon left>mdi-magnify</v-icon>
                      <span>{{ $t("Apply filters") }}</span>
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
import DatePicker from "../components/DatePicker.vue"
export default {
  name: "QuerySettings",
  components: {
    DatePicker,
  },
  props: {
    fields: Array,
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      filtersArray: [],
    }
  },
  mounted() {
    this.loadFiltersFromQuery()
  },

  methods: {
    addFilter() {
      this.filtersArray.push({ key: "", value: "" })
    },
    removeFilter(index) {
      this.filtersArray.splice(index, 1)
    },
    loadFiltersFromQuery() {
      // eslint-disable-next-line no-unused-vars
      const { to, from, sort, order, page, limit, skip, regex, ...filters } =
        this.$route.query
      this.filtersArray = Object.keys(filters).map((key) => ({
        key,
        value: filters[key],
      }))
    },
    applyFilters() {
      const { to, from, regex, limit, skip, order, sort } = this.$route.query

      const filters = this.filtersArray.reduce(
        (prev, { key, value }) => ({ ...prev, [key]: value }),
        {}
      )

      const query = {
        ...{ to, from, regex, limit, skip, order, sort }, // Using this notation to show those are not set in this component
        ...filters,
      }

      if (!this.shallowCompare(query, this.$route.query))
        this.$router.replace({ query })
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
  },
  computed: {
    allFilters() {
      return ["file", "filter", ...this.fields]
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
        console.log({ newVal })
        this.setQueryParam("to", newVal)
      },
    },
    from: {
      get() {
        return this.$route.query.from
      },
      set(newVal) {
        this.setQueryParam("from", newVal)
      },
    },
    regex: {
      get() {
        return this.$route.query.regex
      },
      set(newVal) {
        this.setQueryParam("regex", newVal)
      },
    },
  },
}
</script>
