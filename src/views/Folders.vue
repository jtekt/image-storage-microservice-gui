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
        </v-list>
      </v-menu>
    </v-toolbar>
    <!-- <v-container fluid>
      <QuerySettings :fields="fields" :loading="loading" />
    </v-container> -->

    <v-card-text>
      <div v-if="loading" class="text-center">
        <v-progress-circular indeterminate />
      </div>
      <template v-else>
        <div v-for="folder in folders" :Key="folder">
          <Folder
            :name="folder"
            :depth="1"
            :parents="{ [currentFolder]: folder }"
          />
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import UploadDialog from "../components/UploadDialog.vue"
// import QuerySettings from "../components/QuerySettings.vue"
import ImportDialog from "../components/ImportDialog.vue"
import ExportButton from "../components/ExportButton.vue"
import Folder from "../components/Folder.vue"
const { VUE_APP_FOLDER_STRUCTURE } = process.env

export default {
  name: "Images",
  components: {
    UploadDialog,
    // QuerySettings,
    ImportDialog,
    ExportButton,
    Folder,
  },
  data() {
    return {
      loading: false,
      fields: [],
      folders: [],
      currentFolder: VUE_APP_FOLDER_STRUCTURE.split(",")[0],
    }
  },
  mounted() {
    this.getFolders()
  },
  watch: {},
  methods: {
    getFolders() {
      this.loading = true
      this.axios
        .get(`/fields/${this.currentFolder}`)
        .then(({ data }) => {
          this.folders = data
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  computed: {
    query() {
      return this.$route.query
    },
  },
}
</script>

<style></style>
