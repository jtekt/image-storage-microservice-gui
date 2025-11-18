<template>
  <div>
    <v-chip-group
      v-model="inputType"
      filter
      selected-class="text-primary"
      column
      mandatory
      class="mb-2"
    >
      <v-chip
        key="JSON"
        value="JSON"
        :disabled="!validInput && inputType !== 'JSON'"
      >
        JSON
      </v-chip>

      <v-chip
        key="YAML"
        value="YAML"
        :disabled="!validInput && inputType !== 'YAML'"
      >
        YAML
      </v-chip>
    </v-chip-group>

    <v-textarea
      filled
      :class="autoGrow ? 'field-compose-input' : ''"
      :rows="textareaRows"
      :row-height="20"
      v-model="dataString"
      no-resize
      :auto-grow="autoGrow"
      :error="!validInput"
      :error-messages="errorMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import YAML from "yaml";

const dataString = defineModel<string>();
const inputType = defineModel<"JSON" | "YAML">("inputType", {
  default: "JSON",
});
const parsed = defineModel<any>("parsed", {
  default: null,
});
const valid = defineModel<boolean>("valid", {
  default: true,
});

const props = defineProps<{
  autoGrow?: boolean;
  textareaRows?: number;
}>();

const autoGrow = props.autoGrow ?? true;
const textareaRows = props.textareaRows ?? 5;

const validInput = ref(true);
const errorMessage = ref("");

watch(validInput, (v) => {
  valid.value = v;
});

watch([dataString, inputType], () => {
  validateAndParse();
});

watch(inputType, (newType, oldType) => {
  if (!dataString.value) return;

  try {
    if (newType === "JSON" && oldType === "YAML") {
      const parsedVal = YAML.parse(dataString.value);
      dataString.value =
        parsedVal === undefined ? "{}" : JSON.stringify(parsedVal, null, 2);
    } else if (newType === "YAML" && oldType === "JSON") {
      const parsedVal = JSON.parse(dataString.value);
      dataString.value =
        parsedVal === undefined ? "" : YAML.stringify(parsedVal);
    }
    validateAndParse();
  } catch (e: any) {
    validInput.value = false;
    errorMessage.value = e.message ?? "Invalid format for conversion";
    parsed.value = null;
  }
});

function validateAndParse() {
  if (!dataString.value) {
    validInput.value = true;
    errorMessage.value = "";
    parsed.value = null;
    return;
  }

  try {
    let result: any;
    if (inputType.value === "JSON") {
      result = JSON.parse(dataString.value);
    } else {
      result = YAML.parse(dataString.value);
    }

    if (result === null || typeof result !== "object") {
      throw new Error("Top-level value must be an object or array");
    }

    validInput.value = true;
    errorMessage.value = "";
    parsed.value = result;
  } catch (e: any) {
    validInput.value = false;
    errorMessage.value = e.message ?? "Invalid format";
    parsed.value = null;
  }
}
</script>

<style scoped>
.field-compose-input {
  font-family: monospace;
}
</style>
