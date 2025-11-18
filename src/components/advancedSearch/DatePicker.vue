<template>
  <v-text-field
    type="date"
    :label="label"
    v-model="date"
    variant="underlined"
    prepend-icon="mdi-calendar"
    clearable
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

defineProps<{ label: string }>();
const dateValue = defineModel<string | undefined>();

const date = computed({
  get() {
    if (!dateValue.value) return "";
    const d = new Date(dateValue.value);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
  set(newVal: string) {
    if (!newVal) {
      dateValue.value = "";
      return;
    }
    const utcDate = new Date(
      new Date(newVal).getTime() + new Date().getTimezoneOffset() * 60000
    );
    dateValue.value = utcDate.toISOString();
  },
});
</script>
