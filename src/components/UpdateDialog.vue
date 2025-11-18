<template>
  <v-dialog v-model="dialog" width="40rem">
    <template #activator="{ props }">
      <v-btn block variant="text" v-bind="props" prepend-icon="mdi-lead-pencil">
        <span>{{ dialogLabel }}</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>{{ dialogLabel }}</v-card-title>

      <v-card-text>
        <v-card elevation="0">
          <v-card-title class="font-weight-medium">Fields</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <ImageDataField
                  v-model="dataString"
                  v-model:inputType="inputType"
                  v-model:valid="validInput"
                  v-model:parsed="parsedData"
                  :textarea-rows="4"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="text"
          @click.stop="reset_field"
          prepend-icon="mdi-close"
        >
          <span>close</span>
        </v-btn>

        <v-btn
          variant="text"
          :loading="updating"
          :disabled="!validInput || inputType === undefined"
          @click.stop="updateFields"
          prepend-icon="mdi-lead-pencil"
        >
          <span>Update</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { numberWithCommas } from "@/utils";

const props = defineProps<{
  imageCount?: number;
  selected?: (string | number)[];
}>();

const emit = defineEmits<{
  (e: "updated"): void;
}>();

const axios: any = inject("axios");

const dialog = ref(false);
const updating = ref(false);
const dataString = ref<string>("");

// format & validation coming from child
const inputType = ref<"JSON" | "YAML">("JSON");
const validInput = ref<boolean>(true);
const parsedData = ref<any | null>(null);

const route = useRoute();

const dialogLabel = computed(() => {
  const selected = props.selected ?? [];
  const count = selected.length === 0 ? props.imageCount ?? 0 : selected.length;
  const formatted = numberWithCommas(count);

  return selected.length === 0
    ? `Update ${formatted} images`
    : `Update ${formatted} selected image(s)`;
});

async function updateFields() {
  if (!validInput.value) return;
  if (!confirm("Save changes?")) return;

  if (!parsedData.value) {
    alert("Unable to parse data — please check the input.");
    return;
  }

  let params: Record<string, unknown> = {
    ...(route.query as Record<string, unknown>),
  };

  const sel = props.selected ?? [];
  if (sel.length > 0) {
    params = { ...params, ids: sel };
  }

  updating.value = true;

  try {
    await axios.patch("/images", parsedData.value, { params });
    alert("Update successful");
    reset_field();
    emit("updated");
  } catch (error: any) {
    if (error && error.response) console.log(error.response.data);
    else console.log(error);
    alert("Update failed");
  } finally {
    updating.value = false;
  }
}

function reset_field() {
  dataString.value = "";
  parsedData.value = null;
  dialog.value = false;
}
</script>
