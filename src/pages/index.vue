<template>
  <v-card :loading="loading || fieldsLoading">
    <v-toolbar flat>
      <v-toolbar-title>{{ t("Images") }}</v-toolbar-title>
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props" />
        </template>

        <v-list>
          <v-list-item>
            <UploadDialog />
          </v-list-item>

          <v-list-item>
            <ExportButton :count="total" :selected="selected" />
          </v-list-item>

          <v-list-item>
            <ImportDialog @import="importResult" />
          </v-list-item>

          <v-list-item>
            <UpdateDialog
              @updated="getItemsAndFields()"
              :imageCount="total"
              :selected="selected"
            />
          </v-list-item>

          <v-list-item>
            <DeleteDialog
              @deleted="getItemsAndFields()"
              :count="total"
              :selected="selected"
            />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-container fluid>
      <QueryParameters v-model="query" :fields="fields" :loading="loading" />
    </v-container>

    <v-card-text>
      <v-data-table-server
        v-model="selected"
        v-model:options="options"
        :loading="loading || fieldsLoading"
        :headers="headers"
        :items="items"
        :items-length="total"
        @click:row="rowClicked"
        :footer-props="footerProps"
        show-select
        item-value="_id"
        dense
      >
        <template v-slot:item.file="{ item }">
          <v-img
            max-height="46px"
            max-width="46px"
            contain
            :src="image_src(item)"
          />
        </template>

        <template v-slot:item.time="{ item }: any">
          <span>{{ formatDate(item.time) }}</span>
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>

  <v-snackbar
    :timeout="2000"
    :color="snackbar.color"
    variant="tonal"
    v-model="snackbar.show"
  >
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLocale } from "vuetify";

const { VITE_IMAGE_STORAGE_API_URL } = import.meta.env;
const axios: any = inject("axios");
const { t } = useLocale();
const route = useRoute();
const router = useRouter();

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

const baseHeaders = [
  {
    title: "Image",
    key: "file",
    width: "5em",
  },
  {
    title: "Time",
    key: "time",
    width: "30ch",
  },
];

const footerProps = {
  "items-per-page-options": [10, 50, 100, 500],
};

const loading = ref(false);
const fieldsLoading = ref(false);
const total = ref(0);
const items = ref();
const selected = ref<any[]>([]);
const fields = ref<string[]>([]);

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

const headers = computed(() => {
  const safeFields = Array.isArray(fields.value) ? fields.value : [];
  return [
    ...baseHeaders,
    ...safeFields.map((field: any) => ({
      title: field,
      key: `data.${field}`,
    })),
  ];
});

const options = computed({
  get() {
    const {
      sort = "time",
      order = "-1",
      limit = "10",
      skip = "0",
    } = route.query;

    const limitNum = Number(limit);
    const skipNum = Number(skip);

    return {
      itemsPerPage: limitNum,
      page: skipNum / limitNum + 1,
      sortBy: [
        {
          key: String(sort),
          order: order === "-1" ? "desc" : "asc",
        },
      ],
      groupBy: [],
    };
  },

  set(newVal) {
    const { itemsPerPage, page, sortBy } = newVal;
    const currentSort = sortBy?.[0];

    setQueryParams({
      limit: String(itemsPerPage),
      skip: String((page - 1) * itemsPerPage),
      sort: currentSort?.key ?? "time",
      order: currentSort?.order === "desc" ? "-1" : "1",
    });
  },
});

onMounted(() => {
  const { sort, order, limit, skip } = route.query;

  if (!sort || !order || !limit || !skip) {
    setQueryParams({
      sort: sort ?? "time",
      order: order ?? "-1",
      limit: limit ?? "10",
      skip: skip ?? "0",
    });
  } else getItemsAndFields();
});

const getItemsAndFields = () => {
  getItems();
  getFields();
};

const getFields = async () => {
  fieldsLoading.value = true;

  const params = { ...route.query };
  await axios
    .get("/fields", { params })
    .then((res: any) => {
      fields.value = res.data;
    })
    .catch((err: any) => {
      alert("Failed to query fields");
      console.error(err);
    })
    .finally(() => {
      fieldsLoading.value = false;
    });
};

const getItems = async () => {
  loading.value = true;

  const params = { ...route.query };
  await axios
    .get("/images", { params })
    .then((res: any) => {
      items.value = res.data.items;
      total.value = res.data.total;
    })
    .catch((err: any) => {
      alert("Failed to query data");
      console.error(err);
    })
    .finally(() => {
      loading.value = false;
      resetSelection();
    });
};

const setQueryParams = (newParams: Record<string, any>) => {
  const currentQuery = { ...route.query };
  const newQuery: Record<string, any> = { ...currentQuery };

  Object.entries(newParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      newQuery[key] = value;
    } else {
      delete newQuery[key];
    }
  });

  if (JSON.stringify(currentQuery) === JSON.stringify(newQuery)) return;

  router.replace({ query: newQuery });
};

const rowClicked = (_: any, { item }: any) => {
  const url = router.resolve(`/images/${item._id}`).href;
  window.open(url, "_blank");
};
const resetSelection = () => (selected.value = []);

const image_src = (data: any) => {
  return `${VITE_IMAGE_STORAGE_API_URL}/images/${data._id}/image`;
};

const formatDate = (time: any) => {
  const date = new Date(time);
  return date.toLocaleString();
};

const importResult = (success: boolean) => {
  if (success) {
    snackbar.value = {
      show: true,
      text: "Import successful",
      color: "success",
    };
    getItemsAndFields();
  } else {
    snackbar.value = {
      show: true,
      text: "Import failed",
      color: "error",
    };
  }
};

watch(
  () => route.query,
  () => {
    getItemsAndFields();
  },
  { immediate: true }
);
</script>
<style>
td,
th {
  white-space: nowrap;
  max-width: 15ch;
  overflow: hidden;

  text-overflow: ellipsis;
}
</style>
