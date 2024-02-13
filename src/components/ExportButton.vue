<template>
    <v-btn text block @click="confirm_export()">
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
    props: {
        imageCount: Number,
        selected: [],
    },
    methods: {
        confirm_export() {
            const confirm_message =
                this.selected.length === 0
                    ? `Export ${this.numberWithCommas(this.imageCount)} images?`
                    : `Export ${this.numberWithCommas(
                          this.selected.length
                      )} selected image(s)?`
            if (!confirm(confirm_message)) return
            this.export_collection()
        },
        export_collection() {
            const { limit, skip, sort, order, ...params } = this.query // eslint-disable-line no-unused-vars

            let queryParams = params
            if (this.selected.length > 0)
                queryParams = { ...queryParams, ids: this.selected }
            const urlSearch = Object.keys(queryParams)
                .map((key) => {
                    if (Array.isArray(queryParams[key])) {
                        // If the value is an array, create multiple parameters with the same key
                        return queryParams[key]
                            .map((value) => `${key}=${value}`)
                            .join('&')
                    } else return `${key}=${queryParams[key]}`
                })
                .join('&')

            const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/export?${urlSearch}`
            window.open(url, '_blank')
        },
        numberWithCommas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
        },
    },
    computed: {
        query() {
            return this.$route.query
        },
    },
}
</script>
