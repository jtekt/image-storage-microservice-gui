<template>
  <v-list v-model:opened="opened" color="primary">
    <v-list-group :value="fieldName">
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          :prepend-icon="'mdi-folder-multiple-image'"
          :title="fieldName"
        />
      </template>

      <!-- List Items -->
      <v-list-item
        v-for="(fieldValue, i) in fieldValues"
        :key="i"
        link
        exact
        :to="imageUrl(fieldValue)"
        prepend-icon="mdi-image-multiple"
      >
        <v-list-item-title>{{ fieldValue }}</v-list-item-title>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>
<script setup lang="ts">
import { ref } from "vue";
const axios: any = inject("axios");

const { VITE_CATEGORIZER } = import.meta.env;

const fieldName = ref();
const fieldValues = ref<string[]>();

const opened = ref<string[]>([fieldName.value]);

onMounted(() => {
  if (VITE_CATEGORIZER) fieldName.value = VITE_CATEGORIZER;
  getValueFields();
});

const getValueFields = async () => {
  if (!fieldName.value) return;
  await axios
    .get(`/fields/${fieldName.value}`)
    .then(({ data }: any) => {
      fieldValues.value = data;
    })
    .catch((error: any) => {
      console.error(error);
    });
};

const imageUrl = (fieldValue: string) => {
  const params = new URLSearchParams({
    [fieldName.value]: fieldValue,
    limit: "10",
    skip: "0",
    order: "-1",
    sort: "time",
  });

  return `/?${params.toString()}`;
};
</script>
