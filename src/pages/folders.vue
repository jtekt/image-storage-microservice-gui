<template>
  <v-toolbar flat>
    <v-toolbar-title>{{ t("Folder") }}</v-toolbar-title>

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
      <v-treeview
        indent-lines="default"
        v-model:activated="active"
        v-model:opened="open"
        :items="items"
        :load-children="loadChildren"
        item-title="name"
        item-value="id"
        item-children="children"
        activatable
        open-on-click
        hoverable
        density="comfortable"
        rounded
      >
        <!-- left icon (like docs sample) -->
        <template #prepend="{ item }">
          <v-icon
            v-if="item.type === 'folder'"
            icon="mdi-folder"
            class="mr-1"
          />
          <v-icon
            v-else-if="item.type === 'more'"
            icon="mdi-dots-horizontal"
            class="mr-1"
          />
        </template>

        <!-- label content -->
        <template v-slot:title="{ item }">
          <!-- Folder node -->
          <span v-if="item.type === 'folder'">
            {{ item.name }}
          </span>

          <!-- Each image as a leaf node -->
          <div v-else-if="item.type === 'image'">
            <FolderImagePreview :image="item.image" />
          </div>

          <!-- "X more..." node with link -->
          <div v-else-if="item.type === 'more'">
            <span>{{ item.name }}</span>
            <router-link class="ml-2" :to="imageUrl(item.parents)">
              See all
            </router-link>
          </div>
        </template>
      </v-treeview>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { VITE_FOLDER_STRUCTURE } = import.meta.env;

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const items = ref<any[]>([]);

const active = ref<(string | number)[]>([]);
const open = ref<(string | number)[]>([]);

const folderStructure = (VITE_FOLDER_STRUCTURE || "")
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean);

const rootFolderKey = folderStructure[0] || null;
const imageLimit = 10;

const query = computed<Record<string, any>>({
  get() {
    return route.query as Record<string, any>;
  },
  set(val) {
    const newQuery: Record<string, any> = {};

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

const imageUrl = (q: Record<string, any>) => {
  const params = new URLSearchParams(
    Object.entries(q).map(([key, value]) => [key, String(value)]) as [
      string,
      string
    ][]
  );
  return `/?${params.toString()}`;
};

const loadRootFolders = async () => {
  if (!rootFolderKey) return;

  loading.value = true;
  try {
    const { data } = await axios.get(`/fields/${rootFolderKey}`);

    items.value = (data as string[]).map((folderName, index) => ({
      id: `root-${index}-${folderName}`,
      name: folderName,
      depth: 1,
      parents: { [rootFolderKey]: folderName },
      type: "folder",
      children: [],
    }));
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const loadChildren = async (item: any) => {
  const currentDepth = item.depth;
  const nextFolderKey = folderStructure[currentDepth];

  if (nextFolderKey) {
    try {
      const { data } = await axios.get(`/fields/${nextFolderKey}`, {
        params: { ...item.parents },
      });

      const children: any[] = (data as string[])
        .slice(0, 10)
        .map((folderName, index) => ({
          id: `${item.id}-f-${index}-${folderName}`,
          name: folderName,
          depth: currentDepth + 1,
          parents: {
            ...item.parents,
            [nextFolderKey]: folderName,
          },
          type: "folder",
          children: [],
        }));

      if (!item.children) {
        item.children = [];
      }

      item.children.push(...children);
    } catch (error) {
      console.error(error);
    }

    return;
  }

  try {
    const { data } = await axios.get("/images", {
      params: {
        ...item.parents,
        limit: imageLimit,
      },
    });

    const children: any[] = (data.items as any[]).map((img: any) => ({
      id: img._id || `${item.id}-img-${Math.random().toString(36).slice(2)}`,
      name: img.name || img.filename || img._id || "Image",
      depth: currentDepth + 1,
      parents: { ...item.parents },
      type: "image",
      image: img,
      // leaf nodes: no children
    }));

    if (data.total > data.items.length) {
      const rest = data.total - data.items.length;
      children.push({
        id: `${item.id}-more`,
        name: `${rest} more...`,
        depth: currentDepth + 1,
        parents: { ...item.parents },
        type: "more",
      });
    }

    if (!item.children) {
      item.children = [];
    }

    item.children.push(...children);
  } catch (error) {
    console.error(error);
  }
};

const findItemById = (nodes: any[], id: string | number): any | undefined => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findItemById(node.children, id);
      if (found) return found;
    }
  }
};

watch(active, (newActive) => {
  if (!newActive.length) return;
  const lastId = newActive[newActive.length - 1];
  if (!lastId) return;

  const item = findItemById(items.value, lastId);
  if (!item) return;

  query.value = item.parents;
});

const handleImport = () => {
  loadRootFolders();
};

onMounted(() => {
  loadRootFolders();
});
</script>
