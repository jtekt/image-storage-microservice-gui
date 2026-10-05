<template>
  <v-card>
    <v-toolbar color="transparent" flat>
      <v-toolbar-title
        >Image storage service GUI - {{ VITE_APP_VERSION }}</v-toolbar-title
      >
    </v-toolbar>

    <v-card-text>
      <v-data-table
        hide-default-footer
        :items-per-page="-1"
        :headers="headers"
        :items="services"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import runtimeEnv from "@/runtimeEnv";

interface Service {
  name: string;
  url: string;
}
const { VITE_APP_VERSION, VITE_IMAGE_STORAGE_API_URL } = runtimeEnv;
const headers = [
  { title: "Service", key: "name" },
  { title: "URL", key: "url" },
];

const services = ref<Service[]>([
  {
    name: "No-code AI Training GUI",
    url: window.location.origin,
  },
  {
    name: "Image storage Back-end",
    url: VITE_IMAGE_STORAGE_API_URL,
  },
]);
</script>
