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
          <v-row>
            <v-col>
              <h3>Image</h3>
              <v-file-input v-model="image" label="Image" accept="image/*" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h3>Metadata</h3>
              <ImageDataField
                v-model="dataString"
                v-model:inputType="inputType"
                v-model:valid="validInput"
                v-model:parsed="parsedData"
                :textarea-rows="2"
              />
            </v-col>
          </v-row>
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
            :disabled="!image || !validInput"
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

const dataString = ref<string>("");
const inputType = ref<"JSON" | "YAML">("JSON");
const validInput = ref<boolean>(true);
const parsedData = ref<any | null>(null);

const axios: any = inject("axios");

const upload = async () => {
  if (!image.value) return;
  if (!validInput.value) return;
  uploading.value = true;
  const url = `/images`;
  const body = new FormData();
  body.append("image", image.value);
  body.append("data", JSON.stringify(parsedData.value));

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
