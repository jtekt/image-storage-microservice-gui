<template>
    <v-btn text block @click="export_collection()">
        <v-icon left>mdi-download</v-icon>
        <span>Export</span>
    </v-btn>
</template>

<script>
export default {
    name: 'ExportButton',
    data() {
        return {}
    },
    methods: {
        export_collection() {
            const { limit, skip, sort, order, ...params } = this.query // eslint-disable-line no-unused-vars

            const urlSearch = Object.keys(params)
                .map((key) => `${key}=${params[key]}`)
                .join('&')

            const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/export?${urlSearch}`

            window.open(url, '_blank')
        },
    },
    computed: {
        query() {
            return this.$route.query
        },
    },
}
</script>
