<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title class="font-weight-medium"> Image </v-toolbar-title>

      <template v-slot:append>
        <v-btn
          :loading="deleting"
          color="#c00000"
          icon="mdi-delete"
          @click="deleteItem"
        />
      </template>
    </v-toolbar>

    <v-card-text v-if="item">
      <v-row justify="center">
        <v-col cols="auto">
          <img class="item_image" :src="imageSrc" alt="image" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card elevation="0" variant="outlined">
            <v-toolbar flat>
              <v-toolbar-title class="font-weight-medium">
                System Fields
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-title class="font-weight-medium">
                    ID
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ item._id }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-medium">
                    Time
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ timeFormatted }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-medium">
                    File name
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ item.file }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <ImageDataEditor
            :json="item.data"
            :textarea_row="10"
            title="Editable Fields"
            @save-data="saveData"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ImageDataEditor from "@/components/ImageDataEditor.vue";
import { templateRef } from "vuetify/lib/util/helpers.mjs";

const { VITE_APP_IMAGE_STORAGE_API_URL } = import.meta.env;

const axios: any = inject("axios");

const route = useRoute();
const router = useRouter();

// state
const loading = ref(false);
const deleting = ref(false);
const item = ref<any | null>(null);

const imageId = computed(() => (route.params as Record<string, string>).id);
const imageSrc = computed(() => {
  return `${VITE_APP_IMAGE_STORAGE_API_URL}/images/${imageId.value}/image`;
});

const timeFormatted = computed(() => {
  if (!item.value) return "";
  return new Date(item.value.time).toLocaleString("ja-JP");
});

onMounted(() => {
  getItem();
});

async function getItem() {
  loading.value = true;
  item.value = null;

  try {
    const { data } = await axios.get(`/images/${imageId.value}`);
    item.value = data;
  } catch (err) {
    alert("Failed to fetch image");
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function deleteItem() {
  if (!confirm(`Delete image ${imageId.value}?`)) return;

  deleting.value = true;
  try {
    await axios.delete(`/images/${imageId.value}`);
    router.push("/");
  } catch (err) {
    alert("Failed to delete image");
    console.error(err);
  } finally {
    deleting.value = false;
  }
}

async function saveData(updatedJson: any) {
  try {
    await axios.put(`/images/${imageId.value}`, updatedJson);
    alert("Updated successfully!");
    getItem();
  } catch (err) {
    alert("Failed to update data");
    console.error(err);
  }
}
</script>

<style scoped>
.item_image {
  max-height: 60vh;
}
</style>
