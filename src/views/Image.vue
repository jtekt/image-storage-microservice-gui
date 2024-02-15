<template>
    <v-card :loading="loading">
        <v-toolbar flat>
            <v-row align="center">
                <v-col>
                    <v-toolbar-title class="font-weight-medium">{{
                        $t('Image')
                    }}</v-toolbar-title>
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                    <v-btn
                        :loading="deleting"
                        color="#c00000"
                        icon
                        @click="delete_item()"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-toolbar>

        <v-card-text v-if="item">
            <v-row justify="center">
                <v-col cols="auto">
                    <img class="item_image" :src="image_src" />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card elevation="0" outlined>
                        <v-toolbar flat>
                            <v-row align="center">
                                <v-col>
                                    <v-toolbar-title class="font-weight-medium">
                                        Constant Image Data</v-toolbar-title
                                    >
                                </v-col>
                            </v-row>
                        </v-toolbar>
                        <v-card-text>
                            <v-list>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-subtitle
                                            class="text-button font-weight-medium"
                                            >ID</v-list-item-subtitle
                                        >
                                        <v-list-item-title>{{
                                            item._id
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-subtitle
                                            class="text-button font-weight-medium"
                                            >Time</v-list-item-subtitle
                                        >
                                        <v-list-item-title>{{
                                            time_formatted
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-subtitle
                                            class="text-button font-weight-medium"
                                            >File name</v-list-item-subtitle
                                        >
                                        <v-list-item-title>{{
                                            item.file
                                        }}</v-list-item-title>
                                    </v-list-item-content>
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
                        title="Editable Image Data"
                        @save-data="save_data"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
const { VUE_APP_IMAGE_STORAGE_API_URL } = process.env
import ImageDataEditor from '../components/ImageDataEditor.vue'

export default {
    name: 'Images',
    components: {
        ImageDataEditor,
    },
    data() {
        return {
            loading: false,
            deleting: false,
            item: null,
        }
    },
    mounted() {
        this.get_item()
    },
    computed: {
        image_id() {
            return this.$route.params._id
        },
        image_src() {
            const token = this.$cookies.get('jwt')
            return `${VUE_APP_IMAGE_STORAGE_API_URL}/images/${this.image_id}/image?jwt=${token}`
        },
        time_formatted() {
            const date = new Date(this.item.time)
            return date.toLocaleString('ja-JP')
        },
    },
    methods: {
        get_item() {
            this.loading = true
            this.item = null
            const route = `/images/${this.image_id}`
            this.axios
                .get(route)
                .then(({ data }) => {
                    this.item = data
                })
                .catch((error) => {
                    alert('Failed to query data')
                    console.error(error)
                })
                .finally(() => {
                    this.loading = false
                })
        },
        delete_item() {
            if (!confirm(`Delete image ${this.image_id}?`)) return
            this.deleting = true
            const route = `/images/${this.image_id}`
            this.axios
                .delete(route)
                .then(() => {
                    this.$router.push({ name: 'images' })
                })
                .catch((error) => {
                    alert('Failed to delete data')
                    console.error(error)
                })
                .finally(() => {
                    this.deleting = false
                })
        },
        format_metadata(data) {
            try {
                return JSON.stringify(data, null, 2)
            } catch (error) {
                return data
            }
        },
        save_data(data) {
            const route = `/images/${this.image_id}`
            this.axios
                .put(route, data)
                .then(() => {
                    this.get_item()
                })
                .catch((error) => {
                    alert('Failed to delete data')
                    console.error(error)
                })
        },
    },
}
</script>

<style scoped>
.item_image {
    max-height: 60vh;
}
</style>
