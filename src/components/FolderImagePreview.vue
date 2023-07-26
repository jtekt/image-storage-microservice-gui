<template>
  <router-link :to="{ name: 'image', params: { _id: image._id } }" class="pt-2">
    <v-avatar rounded="0">
      <v-img :src="imageSrc" class="image" />
    </v-avatar>

    <span class="ml-2">{{ image.file }}</span>
  </router-link>
</template>

<script>
const { VUE_APP_IMAGE_STORAGE_API_URL } = process.env

export default {
  name: "FolderImagePreview",
  props: {
    image: Object,
  },
  computed: {
    imageSrc() {
      return `${VUE_APP_IMAGE_STORAGE_API_URL}/images/${this.image._id}/image`
    },
  },
}
</script>

<style scoped>
.image {
  outline: 1px solid red;
}
</style>
