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
                    <v-switch v-model="filtersArray[index].not" label="NOT" />
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
                    <v-btn-toggle v-model="matchMode" color="primary">
                      <v-btn value="AND">AND</v-btn>
                      <v-btn value="OR">OR</v-btn>
                    </v-btn-toggle>
                  </v-col>
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
      matchMode: "AND",
    }
  },
  mounted() {
    this.loadFiltersFromQuery()
  },

  methods: {
    addFilter() {
      this.filtersArray.push({
        key: "",
        value: "",
        not: false,
      })
    },
    removeFilter(index) {
      this.filtersArray.splice(index, 1)
    },
    loadFiltersFromQuery() {
      this.matchMode = "AND"
      // prettier-ignore
      // eslint-disable-next-line no-unused-vars
      const { to, from, sort, order, page, limit, skip, regex, filter, ...filters } = this.$route.query

      // Handle advanced filters (if filter param is JSON)
      if (filter) {
        try {
          const parsed = JSON.parse(filter)
          const clauses = parsed.$and || parsed.$or || []

          this.matchMode = parsed.$or ? "OR" : "AND"

          this.filtersArray = clauses.map((clause) => {
            const key = Object.keys(clause)[0]
            const condition = clause[key]
            const isNot = !!condition.$ne || !!condition.$not
            let value = ""

            if (condition.$regex) value = condition.$regex
            else if (condition.$ne) value = condition.$ne
            else if (condition.$not && condition.$not.$regex)
              value = condition.$not.$regex
            else value = condition

            const cleanKey = key.startsWith("data.") ? key.slice(5) : key

            return { key: cleanKey, value: String(value), not: isNot }
          })
          return
        } catch (err) {
          console.warn("Failed to parse filter JSON", err)
        }
      }

      // Fallback: legacy query params
      this.filtersArray = Object.keys(filters).map((key) => ({
        key,
        value: filters[key],
        not: false,
      }))
    },
    applyFilters() {
      const { to, from, limit, skip, order, sort } = this.$route.query

      // const hasNot = this.filtersArray.some((r) => r.not)
      // const advanced = this.matchMode === "OR" || hasNot || this.regex

      let query = { to, from, limit, skip, order, sort }

      const filterObj = this.buildFilterObject()
      if (filterObj) query.filter = JSON.stringify(filterObj)

      this.filtersArray.forEach(({ key }) => delete query[key])
      delete query.regex

      Object.keys(query).forEach((k) => {
        if (query[k] === undefined || query[k] === null || query[k] === "")
          delete query[k]
      })

      if (!this.shallowCompare(query, this.$route.query)) {
        this.$router.replace({ query })
      }
    },

    isPureNumericString(str) {
      if (typeof str !== "string") return false
      const s = str.trim()
      if (!s) return false
      if (s.length > 1 && s[0] === "0" && !s.startsWith("0.")) return false
      return /^[+-]?((\d+(\.\d*)?)|(\.\d+))([eE][+-]?\d+)?$/.test(s)
    },
    rowToClause(row) {
      const { key, value, not } = row
      if (!key || value === "") return null

      const backendKey =
        key === "file" || key === "_id" || key === "time" ? key : `data.${key}`

      if (this.regex) {
        const regexObj = { $regex: String(value), $options: "i" }
        return not
          ? { [backendKey]: { $not: regexObj } }
          : { [backendKey]: regexObj }
      }

      let coercedValue = value
      if (this.isPureNumericString(value)) {
        const n = Number(value)
        if (!Number.isNaN(n)) coercedValue = n
      }

      return not
        ? { [backendKey]: { $ne: coercedValue } }
        : { [backendKey]: coercedValue }
    },
    buildFilterObject() {
      const clauses = this.filtersArray
        .map((r) => this.rowToClause(r))
        .filter(Boolean)

      if (clauses.length === 0) return null
      return this.matchMode === "AND" ? { $and: clauses } : { $or: clauses }
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
      if (value !== undefined && value !== null && value !== "")
        query[key] = value
      else delete query[key]
      this.$router.replace({ query })
    },
  },
  computed: {
    allFilters() {
      return ["file", ...this.fields]
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
