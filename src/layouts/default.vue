<template>
  <AppHeader title="Image storage service">
    <template #leading>
      <img src="/jtekt_logo_negative.jpg" alt="Logo" />
    </template>
    <template #nav>
      <v-list nav density="comfortable">
        <v-list-item>
          <LocaleSelector />
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item
          to="/"
          prepend-icon="mdi-image-multiple"
          :title="t('Images')"
          exact
        />

        <NavCategories v-if="VITE_APP_CATEGORIZER" />

        <v-list-item
          v-if="VITE_APP_FOLDER_STRUCTURE"
          to="/folders"
          prepend-icon="mdi-file-tree"
          :title="t('Folder')"
          exact
        />
        <v-list-item
          to="/about"
          prepend-icon="mdi-information-outline"
          :title="t('About')"
          exact
        />
      </v-list>
    </template>

    <template #trailing v-if="user">
      <v-btn icon="mdi-logout" @click="logout" />
    </template>
  </AppHeader>
  <v-main>
    <router-view />
  </v-main>

  <AppFooter :app-info="appInfo" :dev-info="devInfo" />
</template>

<script lang="ts" setup>
import { useAuth } from "@moreillon/vue-oidc";
import { useLocale } from "vuetify";

const { VITE_APP_CATEGORIZER, VITE_APP_FOLDER_STRUCTURE } = import.meta.env;
const { logout, user } = useAuth();

const { t } = useLocale();

const appInfo = {
  title: "Image Storage Service",
  href: "http://10.115.1.14/on-premise-gpu-k8s-cluster/ai-platform/image_storage/storage_microservice_front",
};

const devInfo = {
  name: "先端ソフトウェア研究室",
  href: "http://10.115.1.100:31098/groups/731f978e-843d-4d3d-9b8d-4888b2421f0a",
};
</script>
