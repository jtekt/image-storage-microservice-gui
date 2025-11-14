<template>
  <v-btn
    variant="text"
    block
    @click="confirmExport()"
    prepend-icon="mdi-download"
  >
    <span>Export</span>
  </v-btn>
</template>
<script lang="ts" setup>
import { numberWithCommas } from "@/utils";

const route = useRoute();
const props = defineProps<{
  count: number;
  selected: string[];
}>();

const query = computed(() => route.query ?? {});

const confirmExport = async () => {
  const confirm_message =
    props.selected.length === 0
      ? `Export ${numberWithCommas(props.count)} images?`
      : `Export ${numberWithCommas(props.selected.length)} selected image(s)?`;
  if (!confirm(confirm_message)) return;
  exportCollection();
};

const exportCollection = () => {
  const { limit, skip, sort, order, ...params } = query.value;
  let queryParams = params;
  if (props.selected.length > 0) {
    queryParams = { ...queryParams, ids: props.selected };
  }

  const urlSearch = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== undefined)
    .map((key) => {
      const value = queryParams[key];
      if (Array.isArray(value)) {
        return value.map((v) => `${key}=${v}`).join("&");
      }
      return `${key}=${value}`;
    })
    .join("&");

  const url = `${
    import.meta.env.VITE_APP_IMAGE_STORAGE_API_URL
  }/export?${urlSearch}`;

  window.open(url, "_blank");
};
</script>
