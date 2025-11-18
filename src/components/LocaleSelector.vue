<template>
  <v-select
    prepend-inner-icon="mdi-translate"
    :hint="selectedLocale"
    :items="locales"
    item-title="text"
    item-value="value"
    v-model="selectedLocale"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useLocale } from "vuetify";

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
