<template>
  <v-card>
    <v-toolbar flat>
      <v-btn icon exact to="/">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Image storage service GUI</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <p>v {{ version }}</p>
      <v-data-table
        hide-default-footer
        :itemsPerPage="-1"
        :headers="headers"
        :items="services"
      />
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import { version } from "@/../package.json";
const headers = [
  {
    title: "Service",
    key: "name",
  },
  {
    title: "URL",
    key: "url",
  },
];

const services = ref([
  {
    name: "Image storage GUI",
    url: window.location.origin,
  },
  {
    name: "Image storage Back-end",
    url: import.meta.env.VITE_IMAGE_STORAGE_API_URL,
  },
]);
</script>
