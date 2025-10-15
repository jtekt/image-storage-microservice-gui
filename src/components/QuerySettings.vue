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
                <v-row class="mb-4" v-if="hasFilters">
                  <v-col cols="12">
                    <FilterGroup
                      :group="root"
                      :fields-all="allFilters"
                      :is-root="true"
                    />
                  </v-col>
                </v-row>
                <v-row class="mt-2" v-else>
                  <v-col cols="auto">
                    <v-btn color="primary" @click="addFirstFilter">
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
import FilterGroup from "./advanceFilter/FilterGroup.vue"
export default {
  name: "QuerySettings",
  components: {
    DatePicker,
    FilterGroup,
  },
  props: {
    fields: Array,
    loading: { type: Boolean, default: false },
  },
  data() {
    const makeGroup = (op = "AND") => ({ type: "group", op, children: [] })
    return {
      root: null,
      makeGroup,
    }
  },
  mounted() {
    this.loadFiltersFromQuery()
  },

  methods: {
    isTopLevelField(key) {
      return key === "file" || key === "_id" || key === "time"
    },
    toBackendKey(key) {
      return this.isTopLevelField(key) ? key : `data.${key}`
    },
    isPureNumericString(str) {
      if (typeof str !== "string") return false
      const s = str.trim()
      if (!s) return false
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
    nodeToClause(node) {
      if (!node) return null

      if (node.type === "cond") {
        const { key, value, not } = node
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
      }

      if (node.type === "group") {
        const parts = node.children.map(this.nodeToClause).filter(Boolean)
        if (!parts.length) return null
        if (parts.length === 1) return parts[0]
        return node.op === "OR" ? { $or: parts } : { $and: parts }
      }

      return null
    },
    buildFilterObject() {
      const clause = this.nodeToClause(this.root)
      return clause || null
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
    loadFiltersFromQuery() {
      // prettier-ignore
      // eslint-disable-next-line no-unused-vars
      const { to, from, sort, order, page, limit, skip, regex, filter, ...filters } = this.$route.query

      this.regex = regex === "true" || regex === true
      if (filter) {
        try {
          const obj = JSON.parse(filter)
          this.root = this.rehydrateTreeFromQuery(obj) // NEW
          return
        } catch (e) {
          console.log("Malformed filter in URL; falling back to key=value", e)
        }
      }
      const keys = Object.keys(filters)
      if (keys.length) {
        this.root = {
          type: "group",
          op: "AND",
          children: keys.map((key) => ({
            type: "cond",
            key,
            value: String(filters[key] ?? ""),
            not: false,
          })),
        }
      } else {
        this.root = null
      }
    },

    applyFilters() {
      const { to, from, limit, skip, order, sort } = this.$route.query
      let query = { to, from, limit, skip, order, sort }

      const filterObj = this.buildFilterObject()
      if (filterObj) query.filter = JSON.stringify(filterObj)
      else delete query.filter

      // prune empties
      Object.keys(query).forEach((k) => {
        if (query[k] === undefined || query[k] === null || query[k] === "")
          delete query[k]
      })

      if (!this.shallowCompare(query, this.$route.query))
        this.$router.replace({ query })
    },
    rehydrateTreeFromQuery(obj) {
      const makeCond = (keyRaw, val) => {
        const key = keyRaw?.startsWith("data.") ? keyRaw.slice(5) : keyRaw
        let not = false,
          value = ""
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
        return { type: "cond", key, value: String(value ?? ""), not }
      }
      const hydrate = (node) => {
        if (!node || typeof node !== "object") {
          return { type: "group", op: "AND", children: [] }
        }
        if (node.$and || node.$or) {
          const op = node.$or ? "OR" : "AND"
          const arr = node.$or || node.$and
          return {
            type: "group",
            op,
            children: arr.map((part) => {
              if (part.$and || part.$or) return hydrate(part)
              const key = Object.keys(part)[0]
              return makeCond(key, part[key])
            }),
          }
        } else {
          // single condition object { k: v }
          const key = Object.keys(node)[0]
          if (!key) return { type: "group", op: "AND", children: [] }
          return {
            type: "group",
            op: "AND",
            children: [makeCond(key, node[key])],
          }
        }
      }
      return hydrate(obj)
    },
    addFirstFilter() {
      if (!this.root) this.root = this.makeGroup("AND")
      if (!Array.isArray(this.root.children)) this.root.children = []
      this.root.children.push({ type: "cond", key: "", value: "", not: false })
    },
  },
  computed: {
    allFilters() {
      return ["file", ...this.fields]
    },
    hasFilters() {
      return !!(
        this.root &&
        Array.isArray(this.root.children) &&
        this.root.children.length
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
        this.setQueryParam("regex", newVal === "true" ? "true" : undefined)
      },
    },
  },
}
</script>
