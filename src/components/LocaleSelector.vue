<template>
  <v-select
    prepend-inner-icon="mdi-translate"
    :hint="selectedLocale"
    :items="locales"
    item-title="text"
    item-value="value"
    v-model="selectedLocale"
    hide-details
    density="compact"
  />
</template>

<script setup lang="ts">
import { useLocale } from "vuetify";
import { ref, watch, onMounted } from "vue";

onMounted(() => {
  const savedLocale = localStorage.getItem("locale");
  if (!savedLocale) return;
  current.value = savedLocale;
  selectedLocale.value = savedLocale;
});

const { current } = useLocale();

const selectedLocale = ref(current.value);

const locales = ref([
  { text: "English", value: "en" },
  { text: "日本語", value: "ja" },
]);

watch(selectedLocale, () => {
  current.value = selectedLocale.value;
  localStorage.setItem("locale", selectedLocale.value);
});
</script>
