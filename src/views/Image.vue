<template>
    <v-card :loading="loading">
        <v-toolbar flat>
            <v-row align="center">
                <v-col>
                    <v-toolbar-title>{{ $t('Image') }}</v-toolbar-title>
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

            <v-expansion-panels multiple focusable popout v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-medium"
                        >Constant Image Data</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
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
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-medium">
                        Editable Image Data
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col>
                                <v-list>
                                    <v-list-item
                                        v-for="(value, key) in item.data"
                                        :key="key"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-subtitle
                                                class="text-button font-weight-medium"
                                                >{{ key }}</v-list-item-subtitle
                                            >
                                            <v-list-item-title>
                                                <pre>{{
                                                    format_metadata(value)
                                                }}</pre>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
</template>

<script>
const { VUE_APP_IMAGE_STORAGE_API_URL } = process.env

export default {
    name: 'Images',
    data() {
        return {
            loading: false,
            deleting: false,
            item: null,
            panel: [0, 1],
            on_edit: false,
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
        edit_data() {
            this.on_edit = true
        },
        save_data() {
            this.on_edit = false
        },
        cancel_edit() {
            this.on_edit = false
        },
    },
}
</script>

<style scoped>
.item_image {
    max-height: 60vh;
}
</style>
