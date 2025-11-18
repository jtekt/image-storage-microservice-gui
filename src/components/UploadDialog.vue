<template>
  <v-dialog v-model="dialog" width="30rem">
    <template v-slot:activator="{ props }">
      <v-btn block text v-bind="props" prepend-icon="mdi-image-plus">
        <span>Upload</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Upload</v-card-title>

      <v-form @submit.prevent="upload()">
        <v-card-text>
          <v-file-input v-model="image" label="Image" accept="image/*" />
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
            :loading="uploading"
            variant="text"
            :disabled="!image"
            type="submit"
            prepend-icon="mdi-image-plus"
          >
            <span>Upload</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const router = useRouter();
const dialog = ref(false);
const image = ref();
const uploading = ref(false);

const axios: any = inject("axios");

const upload = async () => {
  if (!image.value) return;
  uploading.value = true;
  const url = `/images`;
  const body = new FormData();
  body.append("image", image.value);

  await axios
    .post(url, body)
    .then((res: any) => {
      const { _id } = res.data;
      router.push(`/images/${_id}`);
    })
    .catch((error: any) => {
      alert("Upload failed");
      console.error(error);
    })
    .finally(() => {
      uploading.value = false;
    });
};
</script>
