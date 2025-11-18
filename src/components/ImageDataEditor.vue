<template>
  <v-card v-if="json" elevation="0" variant="outlined">
    <v-toolbar flat>
      <v-toolbar-title class="font-weight-medium">
        {{ title }}
      </v-toolbar-title>
      <template v-slot:append>
        <div v-if="editMode">
          <v-tooltip location="bottom">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                icon
                color="error"
                v-bind="tooltipProps"
                @click.stop="cancelEdit"
              >
                <v-icon icon="mdi-close-box" />
              </v-btn>
            </template>
            <div class="text-center">Cancel Changes</div>
          </v-tooltip>

          <v-tooltip location="bottom">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                icon
                color="success"
                v-bind="tooltipProps"
                :disabled="!inputValid || !parsedData"
                @click.stop="saveData"
              >
                <v-icon icon="mdi-content-save" />
              </v-btn>
            </template>
            <div class="text-center">Save Changes</div>
          </v-tooltip>
        </div>

        <v-tooltip v-else location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              icon="mdi-lead-pencil"
              color="secondary"
              v-bind="tooltipProps"
              @click.stop="startEdit"
            />
          </template>
          <div class="text-center">Edit image properties</div>
        </v-tooltip>
      </template>
    </v-toolbar>

    <v-card-text>
      <ImageDataField
        v-if="editMode"
        v-model="dataString"
        v-model:inputType="inputType"
        v-model:valid="inputValid"
        v-model:parsed="parsedData"
        :textarea-rows="textareaRows"
      />

      <v-list v-else>
        <v-list-item v-for="(value, key) in json" :key="key">
          <v-list-item-title class="font-weight-medium">
            {{ key }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <pre>{{ formatMetadata(value) }}</pre>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  title?: string;
  json?: Record<string, any> | null;
  textarea_row?: number;
}>();

const emit = defineEmits<{
  (e: "save-data", data: any): void;
}>();

// state
const editMode = ref(false);
const dataString = ref<string>("");
const inputType = ref<"JSON" | "YAML">("JSON");
const inputValid = ref<boolean>(true);
const parsedData = ref<any | null>(null);

const textareaRows = computed(() => props.textarea_row ?? 10);

function formatMetadata(data: any) {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return String(data);
  }
}

function startEdit() {
  editMode.value = true;
  if (props.json) {
    dataString.value = formatMetadata(props.json);
    inputType.value = "JSON";
  }
}

function cancelEdit() {
  if (!confirm("Abandon changes?")) return;
  resetChanges();
}

function resetChanges() {
  editMode.value = false;
  dataString.value = "";
  parsedData.value = null;
  inputValid.value = true;
  inputType.value = "JSON";
}

function saveData() {
  if (!inputValid.value || !parsedData.value) return;
  if (!confirm("Save changes?")) return;

  emit("save-data", parsedData.value);
  resetChanges();
}
</script>
