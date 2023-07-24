<template>
  <v-row dense>
    <v-col>
      <v-card outlined>
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span>
                <v-icon left>mdi-magnify</v-icon>
                <span>Query settings</span>
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row align="baseline">
                <v-col cols="">
                  <DatePicker label="From" v-model="from" />
                </v-col>
                <v-col cols="">
                  <DatePicker label="To" v-model="to" />
                </v-col>
              </v-row>

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
                    <span>Add filter</span>
                  </v-btn>
                </v-col>
              </v-row>

              <v-row align="baseline">
                <v-col cols="auto">
                  <v-switch label="Partial match" v-model="regex"></v-switch>
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    @click="applyQuerySettings()"
                    :loading="loading"
                  >
                    <v-icon left>mdi-magnify</v-icon>
                    <span>Apply</span>
                  </v-btn>
                </v-col>
              </v-row>
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
    loading: Boolean,
  },
  data() {
    return {
      from: this.$route.query.from,
      to: this.$route.query.to,
      regex: this.$route.query.regex,
      filtersArray: [],
    }
  },
  mounted() {
    // eslint-disable-next-line no-unused-vars
    const { to, from, sort, order, page, limit, skip, regex, ...filters } =
      this.$route.query
    this.filtersArray = Object.keys(filters).map((key) => ({
      key,
      value: filters[key],
    }))
  },

  methods: {
    addFilter() {
      this.filtersArray.push({ key: "", value: "" })
    },
    removeFilter(index) {
      this.filtersArray.splice(index, 1)
    },
    applyQuerySettings() {
      // Not included here: limit, skip, order, sort

      const { limit, skip, order, sort } = this.$route.query

      const filters = this.filtersArray.reduce(
        (prev, { key, value }) => ({ ...prev, [key]: value }),
        {}
      )

      const query = {
        ...{ limit, skip, order, sort }, // Using this notation to show those are not set in this component
        from: this.from,
        to: this.to,
        regex: this.regex,
        ...filters,
      }

      // PROBLEM: regex becomes a string
      if (!this.shallowCompare(query, this.$route.query))
        this.$router.replace({ query })
    },
    shallowCompare(obj1, obj2) {
      return (
        Object.keys(obj1).length === Object.keys(obj2).length &&
        Object.keys(obj1).every((key) => obj1[key] === obj2[key])
      )
    },
  },
  computed: {
    unusedFilters() {
      return ["file", ...this.fields].filter(
        (f) => !this.filtersArray.map(({ key }) => key).includes(f)
      )
    },
  },
}
</script>
