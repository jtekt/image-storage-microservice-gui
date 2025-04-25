<template>
  <router-link :to="{ name: 'image', params: { _id: image._id } }" class="pt-2">
    <v-avatar rounded="0">
      <v-img :src="imageSrc" class="image" />
    </v-avatar>

    <span class="ml-2">{{ image.file }}</span>
  </router-link>
</template>

<script>
import { getAuthenticationToken } from "../utils/auth.js"
const { VUE_APP_IMAGE_STORAGE_API_URL } = process.env

export default {
  name: "FolderImagePreview",
  props: {
    image: Object,
  },
  computed: {
    imageSrc() {
      const token = getAuthenticationToken(this.$cookies)

      if (!token) {
        alert("No authentication token found")
        return
      }

      return `${VUE_APP_IMAGE_STORAGE_API_URL}/images/${this.image._id}/image?jwt=${token}`
    },
  },
}
</script>

<style scoped>
.image {
  outline: 1px solid red;
}
</style>
