<template>
    <v-dialog v-model="dialog" width="30rem">
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                block
                color="#c00000"
                :loading="deleting"
                text
                v-bind="attrs"
                v-on="on"
            >
                <v-icon left>mdi-delete</v-icon>
                <span>{{ button_label }}</span>
            </v-btn>
        </template>

        <v-card>
            <v-card-title>Delete images</v-card-title>

            <v-card-text>
                <v-row justify="center">
                    <v-col cols="auto">
                        {{ confirm_message }}
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="auto">
                        <v-btn
                            color="primary"
                            :loading="deleting"
                            @click="deleteImages()"
                        >
                            <v-icon left>mdi-delete</v-icon>
                            <span>Delete</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" text @click="dialog = false"
                    >cancel</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'DeleteImages',
    data() {
        return {
            dialog: false,
            deleting: false,
        }
    },
    props: {
        imageCount: Number,
        selected: [],
    },
    methods: {
        async deleteImages() {
            try {
                this.deleting = true
                const url = '/images'
                // FOR NOW, IGNORING SKIP, LIMIT, ORDER and SORT
                const { limit, skip, sort, order, ...params } = this.query // eslint-disable-line no-unused-vars
                let queryParams = params
                if (this.selected.length > 0)
                    queryParams = { ...queryParams, ids: this.selected }
                await this.axios.delete(url, { params: queryParams })
                this.$emit('deleted')
                this.dialog = false
            } catch (error) {
                alert('Deletion failed')
                console.error(error)
            } finally {
                this.deleting = false
            }
        },
        numberWithCommas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
        },
    },
    computed: {
        query() {
            return this.$route.query
        },
        button_label() {
            return this.selected.length === 0
                ? `Delete images`
                : `Delete ${this.numberWithCommas(
                      this.selected.length
                  )} selected image(s)`
        },
        confirm_message() {
            let count =
                this.selected.length === 0
                    ? this.imageCount
                    : this.selected.length
            return `Delete ${this.numberWithCommas(count)} images?`
        },
    },
}
</script>
