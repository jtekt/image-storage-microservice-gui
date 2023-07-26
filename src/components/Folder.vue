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
      <div v-if="this.imageTotal > this.limit" class="pt-2">
        {{ this.imageTotal - this.limit }} more...
        <router-link :to="{ name: 'images', query: parents }">
          See all
        </router-link>
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
      currentFolder: VUE_APP_FOLDER_STRUCTURE.split(",")[this.depth],

      folders: [],
      images: [],
      imageTotal: 0,
      limit: 10,
    }
  },
  mounted() {
    const parentFolder = VUE_APP_FOLDER_STRUCTURE.split(",")[this.depth - 1]
    if (this.$route.query[parentFolder] === this.name) this.openFolder()
  },
  methods: {
    handleFolderClicked() {
      if (this.open) this.closeFolder()
      else this.openFolder()
    },
    async openFolder() {
      // If not last folder, then get folders

      Object.keys(this.parents).forEach((key) => {
        this.setQueryParam(key, this.parents[key])
      })

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
        // TODO: deal with query params
        const url = `/images`
        const params = {
          ...this.parents,
          limit: this.limit,
        }
        this.loading = true
        try {
          const { data } = await this.axios.get(url, { params })
          this.images = data.items
          this.imageTotal = data.total
        } catch (error) {
          alert(error)
        } finally {
          this.loading = false
        }
      }
    },
    closeFolder() {
      this.folders = []
      this.images = []
      this.setQueryParam(this.currentFolder, undefined)
    },
    setQueryParam(key, value) {
      if (this.$route.query[key] === value) return
      const query = { ...this.$route.query }
      if (value) query[key] = value
      else delete query[key]
      /* router.replace acts like router.push, the only difference is that it navigates without pushing a new history entry, as its name suggests - it replaces the current entry. */
      this.$router.replace({ query })
    },
  },
  computed: {
    open() {
      return this.folders.length || this.images.length
    },
  },
}
</script>
