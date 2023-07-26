<template>
  <div>
    <v-btn @click="openFolder()" text :loading="loading">
      <v-icon left v-if="open">mdi-folder-open</v-icon>
      <v-icon left v-else>mdi-folder</v-icon>
      <span>{{ name }}</span>
    </v-btn>
    <div class="ml-6" v-if="folders.length">
      <div v-for="folder in folders" :Key="folder">
        <Folder
          :name="folder"
          :depth="depth + 1"
          :parents="{ ...parents, [currentFolder]: folder }"
        />
      </div>
    </div>
    <div class="ml-6" v-if="images.length">
      <div v-for="image in images" :Key="image._id">
        <FolderImagePreview :image="image" />
      </div>
    </div>
  </div>
</template>

<script>
import FolderImagePreview from "./FolderImagePreview.vue"
const { VUE_APP_FOLDER_STRUCTURE } = process.env
export default {
  name: "Folder",
  components: {
    FolderImagePreview,
  },
  props: {
    depth: Number,
    name: String,
    parents: undefined,
  },
  data() {
    return {
      loading: false,
      currentFolder: "",
      folders: [],
      images: [],
    }
  },
  methods: {
    async openFolder() {
      if (this.folders.length) {
        this.folders = []
        return
      }
      if (this.images.length) {
        this.images = []
        return
      }
      this.currentFolder = VUE_APP_FOLDER_STRUCTURE.split(",")[this.depth]
      // If not last folder, then get folders
      if (this.currentFolder) {
        const url = `/fields/${this.currentFolder}`
        const params = {
          ...this.parents,
        }
        this.loading = true
        try {
          const { data } = await this.axios.get(url, { params })
          this.folders = data.slice(0, 10)
        } catch (error) {
          alert(error)
        } finally {
          this.loading = false
        }
      } else {
        const url = `/images`
        const params = {
          ...this.parents,
          limit: 10,
        }
        this.loading = true
        try {
          const { data } = await this.axios.get(url, { params })
          this.images = data.items
        } catch (error) {
          alert(error)
        } finally {
          this.loading = false
        }
      }
    },
  },
  computed: {
    open() {
      return this.folders.length || this.images.length
    },
  },
}
</script>
