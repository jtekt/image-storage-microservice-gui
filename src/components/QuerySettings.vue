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
                  <v-col cols="auto" v-if="index > 0">
                    <v-btn-toggle
                      v-model="filtersArray[index].join"
                      dense
                      mandatory
                      color="primary"
                    >
                      <v-btn value="AND">AND</v-btn>
                      <v-btn value="OR">OR</v-btn>
                    </v-btn-toggle>
                  </v-col>

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
      this.filtersArray.push({ key: "", value: "", not: false, join: "AND" })
    },
    removeFilter(index) {
      this.filtersArray.splice(index, 1)
    },
    loadFiltersFromQuery() {
      // prettier-ignore
      // eslint-disable-next-line no-unused-vars
      const { to, from, sort, order, page, limit, skip, regex, filter, ...filters } = this.$route.query

      this.regex = regex === "true" || regex === true

      if (filter) {
        try {
          const obj = JSON.parse(filter)
          this.buildFiltersWithUrlFilters(obj)
          return
        } catch (e) {
          console.log("Malformed filter in URL; falling back to key=value", e)
        }
      }

      const keys = Object.keys(filters)
      this.filtersArray = keys.length
        ? keys.map((key, i) => ({
            key,
            value: filters[key],
            not: false,
            join: "AND",
          }))
        : []
    },
    applyFilters() {
      const { to, from, limit, skip, order, sort } = this.$route.query
      let query = { to, from, limit, skip, order, sort }

      const filterObj = this.buildFilterFromFlatRows()
      if (filterObj) query.filter = JSON.stringify(filterObj)
      else delete query.filter

      this.filtersArray.forEach(({ key }) => delete query[key])

      Object.keys(query).forEach((k) => {
        if (query[k] === undefined || query[k] === null || query[k] === "")
          delete query[k]
      })

      if (!this.shallowCompare(query, this.$route.query))
        this.$router.replace({ query })
    },
    buildFilterFromFlatRows() {
      const groups = []
      let current = []

      this.filtersArray.forEach((row, idx) => {
        const clause = this.rowToClause(row)
        if (!clause) return

        if (idx === 0) {
          current = [clause]
          return
        }

        if (row.join === "OR") current.push(clause)
        else {
          groups.push(current)
          current = [clause]
        }
      })

      if (current.length) groups.push(current)
      if (!groups.length) return null

      if (groups.length === 1) {
        const g = groups[0]
        return g.length === 1 ? g[0] : { $or: g }
      }
      return { $and: groups.map((g) => (g.length === 1 ? g[0] : { $or: g })) }
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
    isPureNumericString(str) {
      if (typeof str !== "string") return false
      const s = str.trim()
      if (!s) return false
      // avoid converting codes like "00123"
      if (s.length > 1 && s[0] === "0" && !s.startsWith("0.")) return false
      return /^[+-]?((\d+(\.\d*)?)|(\.\d+))([eE][+-]?\d+)?$/.test(s)
    },
    parseValue(value) {
      if (this.isPureNumericString(value)) {
        const n = Number(value)
        return Number.isNaN(n) ? value : n
      }
      return value
    },
    isTopLevelField(key) {
      return key === "file" || key === "_id" || key === "time"
    },
    toBackendKey(key) {
      return this.isTopLevelField(key) ? key : `data.${key}`
    },
    rowToClause({ key, value, not }) {
      if (!key || value === "") return null
      const backendKey = this.toBackendKey(key)

      if (this.regex) {
        const regexObj = { $regex: String(value), $options: "i" }
        return not
          ? { [backendKey]: { $not: regexObj } }
          : { [backendKey]: regexObj }
      }

      const parsedValue = this.parseValue(value)
      return not
        ? { [backendKey]: { $ne: parsedValue } }
        : { [backendKey]: parsedValue }
    },
    buildFiltersWithUrlFilters(obj) {
      const rows = []
      const push = (clause, joinWithPrev) => {
        const keyRaw = Object.keys(clause)[0]
        const val = clause[keyRaw]
        const key = keyRaw.startsWith("data.") ? keyRaw.slice(5) : keyRaw

        let not = false
        let value

        if (val && typeof val === "object") {
          if ("$ne" in val) {
            not = true
            value = val.$ne
          } else if ("$not" in val && val.$not?.$regex !== undefined) {
            not = true
            value = val.$not.$regex
          } else if ("$regex" in val) {
            value = val.$regex
          } else if ("$eq" in val) {
            value = val.$eq
          } else {
            value = ""
          }
        } else {
          value = val
        }

        rows.push({
          key,
          value: String(value ?? ""),
          not,
          join: joinWithPrev || "AND",
        })
      }

      if (obj?.$or) {
        obj.$or.forEach((c, i) => push(c, i === 0 ? "AND" : "OR"))
      } else if (obj?.$and) {
        obj.$and.forEach((group) => {
          if (group.$or) {
            group.$or.forEach((c, i) =>
              push(c, rows.length === 0 ? "AND" : i === 0 ? "AND" : "OR")
            )
          } else {
            push(group, rows.length === 0 ? "AND" : "AND")
          }
        })
      } else if (obj && Object.keys(obj).length) {
        push(obj, "AND")
      }

      this.filtersArray = rows
    },
  },
  computed: {
    allFilters() {
      return ["file", ...this.fields]
    },
    unusedFilters() {
      //TODO: Temporarily allow duplicates.
      // const used = new Set(this.filtersArray.map(r => r.key).filter(Boolean))
      // return this.allFilters.filter(f => !used.has(f))
      return this.allFilters
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
