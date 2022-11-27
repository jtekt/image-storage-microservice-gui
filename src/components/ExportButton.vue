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
        return {

        }
    },
    methods: {
        export_collection() {
            // TODO: Export according to filters
            const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/export`
            window.open(url, '_blank')
        },


    },
    computed: {

    }

}
</script>
