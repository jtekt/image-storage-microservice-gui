<template>
  <v-toolbar flat>
    <v-toolbar-title>{{ t("Images") }}</v-toolbar-title>

    <v-spacer />

    <v-menu location="bottom" :offset="8">
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon icon="mdi-dots-vertical" />
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <UploadDialog />
        </v-list-item>

        <v-list-item>
          <ExportButton :query="query" :count="0" :selected="[]" />
        </v-list-item>

        <v-list-item>
          <ImportDialog @import="handleImport" />
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>

  <v-container>
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate />
    </div>
    <template v-else>
      <div v-for="folder in folders" :key="folder">
        <Folder
          :name="folder"
          :depth="1"
          :parents="{ [currentFolder]: folder }"
        />
      </div>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
const { VITE_FOLDER_STRUCTURE } = import.meta.env;

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const folders = ref<string[]>([]);

const currentFolder = ref();

const query = computed<Record<string, any>>({
  get() {
    return route.query as Record<string, any>;
  },
  set(val) {
    const newQuery: Record<string, any> = {};

    // prune empty values, like setQueryParams does
    Object.entries(val || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        newQuery[key] = value;
      }
    });

    const currentQuery = route.query as Record<string, any>;
    if (JSON.stringify(currentQuery) === JSON.stringify(newQuery)) return;

    router.replace({ query: newQuery });
  },
});

onMounted(() => {
  if (VITE_FOLDER_STRUCTURE) {
    currentFolder.value = (VITE_FOLDER_STRUCTURE || "").split(",")[0] || "";
  }
  getFolders();
});
const getFolders = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get(`/fields/${currentFolder.value}`);
    folders.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleImport = () => {
  getFolders();
};
</script>
