<template>
  <v-card :loading="loading || fieldsLoading">
    <v-toolbar flat>
      <v-toolbar-title>{{ $t("Images") }}</v-toolbar-title>
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <UploadDialog />
          </v-list-item>

          <v-list-item>
            <ExportButton :imageCount="total" :selected="selectedIds" />
          </v-list-item>

          <v-list-item>
            <ImportDialog @import="get_items_and_fields()" />
          </v-list-item>

          <v-list-item>
            <UpdateDialog
              @updated="get_items_and_fields()"
              :imageCount="total"
              :selected="selectedIds"
            />
          </v-list-item>

          <v-list-item>
            <DeleteDialog
              @deleted="get_items_and_fields()"
              :imageCount="total"
              :selected="selectedIds"
            />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-container fluid>
      <QuerySettings :fields="fields" :loading="loading" />
    </v-container>

    <v-card-text>
      <v-data-table
        :loading="loading || fieldsLoading"
        :headers="headers"
        :items="items"
        :server-items-length="total"
        :options.sync="options"
        @click:row="row_clicked($event)"
        :footer-props="footerProps"
        v-model="selected"
        :show-select="allow_select"
        item-key="_id"
      >
        <template v-slot:item.file="{ item }">
          <v-img
            max-height="5em"
            max-width="5em"
            contain
            :src="image_src(item)"
          />
        </template>

        <template v-slot:item.time="{ item }">
          <span>{{ format_date(item.time) }}</span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import UploadDialog from "../components/UploadDialog.vue"
import QuerySettings from "../components/QuerySettings.vue"
import ImportDialog from "../components/ImportDialog.vue"
import DeleteDialog from "../components/DeleteDialog.vue"
import ExportButton from "../components/ExportButton.vue"
import UpdateDialog from "../components/UpdateDialog.vue"
import { getAuthenticationToken } from "../utils/auth.js"

const { VUE_APP_IMAGE_STORAGE_API_URL } = process.env

export default {
  name: "Images",
  components: {
    UploadDialog,
    QuerySettings,
    ImportDialog,
    DeleteDialog,
    ExportButton,
    UpdateDialog,
  },
  data() {
    return {
      selected: [],
      allow_select: true,
      loading: false,
      fields: [],
      field: null,
      fieldsLoading: false,
      base_headers: [
        { text: "Image", value: "file", width: "5em" },
        { text: "Time", value: "time", width: "30ch" },
      ],
      footerProps: { "items-per-page-options": [10, 50, 100, 500] },
      extra_headers: [],
      items: [],
      total: 0,
    }
  },
  mounted() {
    this.get_items_and_fields()
  },
  watch: {
    query() {
      this.get_items()
    },
  },
  methods: {
    get_items() {
      this.loading = true
      this.items = []

      const params = { ...this.query }

      this.axios
        .get("/images", { params })
        .then(({ data }) => {
          this.items = data.items
          this.total = data.total
        })
        .catch((error) => {
          alert("Failed to query data")
          console.error(error)
        })
        .finally(() => {
          this.loading = false
          this.reset_selection()
        })
    },
    get_fields() {
      this.fieldsLoading = true
      this.axios
        .get("/fields")
        .then(({ data }) => {
          this.fields = data
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.fieldsLoading = false
        })
    },
    row_clicked({ _id }) {
      const routeData = this.$router.resolve({
        name: "image",
        params: { _id },
      })
      window.open(routeData.href, "_blank")
    },
    format_date(time) {
      const date = new Date(time)
      return date.toLocaleString()
    },
    image_src({ _id }) {
      const token = getAuthenticationToken(this.$cookies)

      if (!token) {
        alert("No authentication token found")
        return
      }

      return `${VUE_APP_IMAGE_STORAGE_API_URL}/images/${_id}/image?jwt=${token}`
    },

    get_items_and_fields() {
      this.get_items()
      this.get_fields()
    },
    set_query_params(newParams) {
      const query = { ...this.query }

      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query[key] = value
        } else {
          delete query[key]
        }
      })

      // Prevent redundant navigation
      if (JSON.stringify(query) === JSON.stringify(this.$route.query)) return

      this.$router.replace({ query })
    },
    reset_selection() {
      this.selected = []
    },
  },
  computed: {
    headers() {
      return [
        ...this.base_headers,
        ...this.fields.map((f) => ({ text: f, value: `data.${f}` })),
      ]
    },
    query() {
      return this.$route.query
    },
    selectedIds() {
      // Extract _id from selected items
      return this.selected.map((item) => item._id)
    },

    options: {
      get() {
        // Those are not defaults, those are values which are set if the table does not set them
        const {
          sort = "time",
          order = "-1", // Does not become default for some reason
          limit = 10,
          skip = 0,
        } = this.$route.query

        return {
          itemsPerPage: Number(limit),
          sortBy: [sort],
          sortDesc: [order === "-1"],
          page: skip / limit + 1,
        }
      },
      set(newVal) {
        // When the table sets some options

        const { itemsPerPage, page, sortBy, sortDesc } = newVal

        const params = {
          limit: String(itemsPerPage),
          skip: String((page - 1) * itemsPerPage),
          order: String(sortDesc[0] ? -1 : 1),
          sort: sortBy[0],
        }

        // Set all query params once

        this.set_query_params(params)
      },
    },
  },
}
</script>

<style>
td,
th {
  white-space: nowrap;
  max-width: 10ch;
  overflow: hidden;

  text-overflow: ellipsis;
}
</style>
