<template>
  <v-card>
    <v-toolbar color="transparent" flat>
      <v-toolbar-title>Image storage service GUI</v-toolbar-title>
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
import { ref, inject } from "vue";
const axios: any = inject("axios");
import runtimeEnv from "@/runtimeEnv";

interface Service {
  name: string;
  version: string | null;
  url: string;
}
const { VITE_APP_VERSION, VITE_IMAGE_STORAGE_API_URL } = runtimeEnv;

const headers = [
  { title: "Service", key: "name" },
  { title: "Version", key: "version" },
  { title: "URL", key: "url" },
];

const getFullUrl = (url: string) => {
  return url.startsWith("http") ? url : `${window.location.origin}${url}`;
};

const services = ref<Service[]>([
  {
    name: "Image storage service GUI",
    version: VITE_APP_VERSION,
    url: window.location.origin,
  },
  {
    name: "Image storage Back-end",
    version: null,
    url: getFullUrl(VITE_IMAGE_STORAGE_API_URL),
  },
]);

onMounted(() => {
  services.value.forEach((service) => {
    if (service.version) return;
    service.version = "Connecting...";
    axios
      .get(service.url)
      .then(({ data }: any) => {
        service.version = data.version;
      })
      .catch(() => {
        service.version = "Unable to connect";
      });
  });
});
</script>
