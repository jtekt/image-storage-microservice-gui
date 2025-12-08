<template>
  <v-dialog v-model="dialog" max-width="40rem" max-height="40rem">
    <template #activator="{ props: activatorProps }">
      <v-btn
        variant="text"
        v-bind="activatorProps"
        prepend-icon="mdi-table-column"
      >
        <span>{{ t("Customize columns") }}</span>
      </v-btn>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>{{ t("Customize columns") }}</v-toolbar-title>

        <v-spacer />
        <v-btn variant="text" @click="dialog = false">
          <v-icon left>mdi-close</v-icon>
          <span>{{ t("Close") }}</span>
        </v-btn>
      </v-toolbar>

      <v-card-text class="list_container">
        <v-list v-if="headers && headers.length">
          <v-list-item
            v-for="header in headers"
            :key="header.value"
            class="header_item"
          >
            <v-list-item-title>{{ header.text }}</v-list-item-title>

            <template #append>
              <v-checkbox
                v-model="header.visible"
                color="primary"
                :label="t('Visible')"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useCustomHeader } from "@/composables/useCustomHeader";
import { useLocale } from "vuetify";

const { restoreHeaders } = useCustomHeader();
const { t } = useLocale();
const headers = defineModel<any[]>("headers", { required: true });

const dialog = ref(false);
const storageKey = "customTableHeaders";

const originalHeaders = ref<any[]>(headers.value);

const clone = (val: any) => JSON.parse(JSON.stringify(val));

onMounted(() => {
  if (headers.value?.length && !originalHeaders.value.length) {
    originalHeaders.value = clone(headers.value);
  }

  headers.value = restoreHeaders(headers.value);
});

watch(
  () => headers.value,
  (val) => {
    localStorage.setItem(storageKey, JSON.stringify(val ?? []));
  },
  { deep: true }
);
</script>

<style scoped>
.list_container {
  max-height: 30rem;
  overflow-y: auto;
}

.header_item {
  min-height: 3rem;
}
</style>
