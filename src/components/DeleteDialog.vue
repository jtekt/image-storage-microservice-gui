<template>
  <v-dialog v-model="dialog" width="30rem">
    <template v-slot:activator="{ props }">
      <v-btn
        block
        color="#c00000"
        :loading="deleting"
        variant="text"
        v-bind="props"
        prepend-icon="mdi-delete"
      >
        <span>{{ buttonLabel }}</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Delete images</v-card-title>

      <v-card-text>
        <v-row justify="center">
          <v-col cols="auto">
            {{ confirmMessage }}
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn
              color="primary"
              :loading="deleting"
              @click="deleteImages()"
              prepend-icon="mdi-delete"
            >
              <span>Delete</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="dialog = false">cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { numberWithCommas } from "@/utils";

const axios: any = inject("axios");
const emit = defineEmits(["deleted"]);
const props = defineProps<{
  count: number;
  selected: string[];
  query: any;
}>();

const dialog = ref(false);
const deleting = ref(false);

const confirmMessage = computed(() => {
  let count = props.selected.length === 0 ? props.count : props.selected.length;
  return `Delete ${numberWithCommas(count)} images?`;
});
const buttonLabel = computed(() => {
  return props.selected.length === 0
    ? `Delete images`
    : `Delete ${numberWithCommas(props.selected.length)} selected image(s)`;
});

const deleteImages = async () => {
  deleting.value = true;
  const { limit, skip, sort, order, ...params } = props.query;
  let queryParams = params;
  if (props.selected.length > 0)
    queryParams = { ...queryParams, ids: props.selected };
  await axios
    .delete("/images", { params: queryParams })
    .then(() => {
      dialog.value = false;
      emit("deleted");
    })
    .catch((error: any) => {
      console.error(error);
    })
    .finally(() => {
      deleting.value = false;
    });
};
</script>
