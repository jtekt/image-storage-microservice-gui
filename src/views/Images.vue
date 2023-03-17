<template>
  <v-card>
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
            <ExportButton />
          </v-list-item>

          <v-list-item>
            <ImportDialog @import="get_items_and_fields()" />
          </v-list-item>

          <v-list-item>
            <DeleteDialog
              @deleted="get_items_and_fields()"
              :imageCount="total"
            />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-container fluid>
      <QuerySettings :fields="fields" />
    </v-container>

    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="items"
        :server-items-length="total"
        :options.sync="options"
        @click:row="row_clicked($event)"
        :footer-props="footerProps"
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

export default {
  name: "Images",
  components: {
    UploadDialog,
    QuerySettings,
    ImportDialog,
    DeleteDialog,
    ExportButton,
  },
  data() {
    return {
      loading: false,
      fields: [],
      field: null,
      base_headers: [
        { text: "Image", value: "file" },
        { text: "Time", value: "time" },
      ],
      footerProps: { "items-per-page-options": [10, 50, 100, -1] },
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
        })
    },
    get_fields() {
      this.axios
        .get("/fields")
        .then(({ data }) => {
          this.fields = data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    row_clicked({ _id }) {
      this.$router.push({ name: "image", params: { _id } })
    },
    format_date(time) {
      const date = new Date(time)
      return date.toLocaleString()
    },
    image_src({ _id }) {
      // TODO: Deal with authentication
      return `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images/${_id}/image`
    },

    get_items_and_fields() {
      this.get_items()
      this.get_fields()
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

    options: {
      get() {
        // Those are not defaults, those are values which are set if the table does not set them
        const {
          limit = 10,
          sort = "time",
          order = -1, // Does not become default for some reason
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

        const query = { ...this.$route.query, ...params }

        // Preventing route duplicates
        // Stringify is dirty
        if (JSON.stringify(this.$route.query) !== JSON.stringify(query))
          this.$router.push({ query })
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
