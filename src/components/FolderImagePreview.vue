<template>
  <router-link :to="`/images/${image._id}`" class="pt-2 d-flex align-center">
    <v-avatar rounded="0" size="64">
      <v-img :src="imageSrc" cover class="image" />
    </v-avatar>

    <span class="ml-2">{{ image.file }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  image: any;
}>();

const API_URL = import.meta.env.VITE_APP_IMAGE_STORAGE_API_URL;

const imageSrc = computed(() => {
  return `${API_URL}/images/${props.image._id}/image`;
});
</script>

<style scoped>
.image {
  outline: 1px solid red;
}
</style>
