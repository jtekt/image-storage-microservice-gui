<template>
  <v-app-bar color="#000">
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-app-bar-title>Image storage service</v-app-bar-title>
    <template #append>
      <LocaleSelector />
      <ThemeToggle />
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer">
    <v-list nav density="comfortable">
      <v-list-item
        to="/"
        prepend-icon="mdi-image-multiple"
        :title="t('Images')"
      />

      <NavCategories v-if="categorizer" />

      <v-list-item
        v-if="folderStructure"
        to="/folders"
        prepend-icon="mdi-file-tree"
        :title="t('Folder')"
      />
      <v-list-item
        to="/about"
        prepend-icon="mdi-information-outline"
        :title="t('About')"
      />
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useLocale } from "vuetify";
const { VITE_CATEGORIZER, VITE_FOLDER_STRUCTURE } = import.meta.env;
const categorizer = ref(VITE_CATEGORIZER);
const folderStructure = ref(VITE_FOLDER_STRUCTURE);
const { t } = useLocale();
const drawer = ref(true);
</script>
