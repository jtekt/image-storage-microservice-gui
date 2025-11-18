<template>
  <v-dialog v-model="dialog" width="40rem">
    <template v-slot:activator="{ props }">
      <v-btn block variant="text" v-bind="props" prepend-icon="mdi-upload">
        <span>Import</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Import</v-card-title>

      <v-form @submit.prevent="importArchive()">
        <v-card-text>
          <v-file-input
            accept=".zip"
            label="Archive (.zip)"
            v-model="archive"
          />
        </v-card-text>
        <v-card-text>
          <v-progress-linear height="25" :value="progress" rounded>
            {{ progress }}%
          </v-progress-linear>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            variant="text"
            @click="dialog = false"
            prepend-icon="mdi-close"
          >
            <span>close</span>
          </v-btn>

          <v-btn
            variant="text"
            type="submit"
            :loading="uploading"
            :disabled="!archive"
            prepend-icon="mdi-upload"
          >
            <span>Import</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const axios: any = inject("axios");
const emit = defineEmits(["import"]);

const dialog = ref(false);
const uploading = ref(false);
const progress = ref(0);
const archive = ref();

const importArchive = async () => {
  uploading.value = true;
  progress.value = 0;

  const body = new FormData();
  body.append("archive", archive.value);

  const options = {
    onUploadProgress: (progressEvent: any) => {
      progress.value = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
    },
    headers: { "Content-Type": "multipart/form-data" },
  };

  await axios
    .post("/import", body, options)
    .then(() => {
      archive.value = null;
      dialog.value = false;
      emit("import", true);
    })
    .catch((error: any) => {
      emit("import", false);

      console.error(error);
    })
    .finally(() => {
      uploading.value = false;
      progress.value = 0;
    });
};
</script>
