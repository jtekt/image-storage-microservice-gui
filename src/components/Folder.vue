<template>
  <div>
    <v-btn variant="text" :loading="loading" @click="openFolder">
      <v-icon class="mr-2" :icon="open ? 'mdi-folder-open' : 'mdi-folder'" />
      <span>{{ name }}</span>
    </v-btn>

    <div class="ml-6" v-if="folders.length">
      <div v-for="folder in folders" :key="folder">
        <Folder
          :name="folder"
          :depth="depth + 1"
          :parents="{ ...parents, [currentFolder]: folder }"
        />
      </div>
    </div>

    <div class="ml-6" v-if="images.length">
      <div v-for="image in images" :key="image._id">
        <FolderImagePreview :image="image" />
      </div>

      <div v-if="imageTotal > limit" class="pt-2">
        {{ imageTotal - limit }} more...
        <router-link :to="imageUrl(parents)"> See all </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const { VITE_FOLDER_STRUCTURE } = import.meta.env;

const route = useRoute();
const router = useRouter();
const props = defineProps<{
  depth: number;
  name: string;
  parents: Record<string, any>;
}>();

const folderStructure = (VITE_FOLDER_STRUCTURE || "").split(",");

const loading = ref(false);
const folders = ref<string[]>([]);
const images = ref<any[]>([]);
const imageTotal = ref(0);
const limit = ref(10);

const currentFolder = computed(() => folderStructure[props.depth]);

const open = computed(
  () => folders.value.length > 0 || images.value.length > 0
);

onMounted(() => {
  const parentFolderKey = folderStructure[props.depth - 1];
  if (parentFolderKey && route.query[parentFolderKey] === props.name) {
    openFolder();
  }
});

const setQueryParam = (key: string | undefined, value: any) => {
  if (!key) return;

  const current = route.query[key];
  if (current === value) return;

  const query: Record<string, any> = { ...route.query };
  if (value !== undefined && value !== null && value !== "") {
    query[key] = value;
  } else {
    delete query[key];
  }

  router.replace({ query });
};

const openFolder = async () => {
  Object.keys(props.parents).forEach((key) => {
    setQueryParam(key, props.parents[key]);
  });

  if (currentFolder.value) {
    const url = `/fields/${currentFolder.value}`;
    const params = {
      ...props.parents,
    };

    loading.value = true;
    try {
      const { data } = await axios.get(url, { params });
      folders.value = data.slice(0, 10);
      images.value = [];
      imageTotal.value = 0;
    } catch (error) {
      alert(error);
    } finally {
      loading.value = false;
    }
  } else {
    const url = `/images`;
    const params = {
      ...props.parents,
      limit: limit.value,
    };

    loading.value = true;
    try {
      const { data } = await axios.get(url, { params });
      images.value = data.items;
      imageTotal.value = data.total;
      folders.value = [];
    } catch (error) {
      alert(error);
    } finally {
      loading.value = false;
    }
  }
};

const closeFolder = () => {
  folders.value = [];
  images.value = [];
  imageTotal.value = 0;
  setQueryParam(currentFolder.value, undefined);
};

// if you ever want toggle behavior:
// const handleFolderClicked = () => {
//   if (open.value) closeFolder()
//   else openFolder()
// }

const imageUrl = (query: Record<string, any>) => {
  const params = new URLSearchParams(
    Object.entries(query).map(([key, value]) => [key, String(value)]) as [
      string,
      string
    ][]
  );

  return `/?${params.toString()}`;
};
</script>
