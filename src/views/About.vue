<template>
    <v-card>
        <v-toolbar flat>
            <v-btn icon exact :to="{ name: 'images' }">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>Image storage service GUI</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
            <p>v {{ version }}</p>
            <p>
                Developed and maintainted by Maxime Moreillon, JTEKT Corporation
            </p>
            <v-data-table
                hide-default-footer
                :itemsPerPage="-1"
                :headers="headers"
                :items="services"
            />
        </v-card-text>
    </v-card>
</template>

<script>
import { version } from '@/../package.json'
export default {
    name: 'About',
    data() {
        return {
            version,
            headers: [
                { text: 'Service', value: 'name' },
                { text: 'Version', value: 'version' },
            ],
            services: [
                {
                    name: 'Image storage GUI',
                    url: window.location.origin,
                },
                {
                    name: 'Image storage Back-end',
                    url: process.env.VUE_APP_IMAGE_STORAGE_API_URL,
                },
            ],
        }
    },
}
</script>

<style scoped></style>
