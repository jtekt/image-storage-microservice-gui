<template>
    <v-btn color="#c00000" @click=deleteImages() :loading="deleting" text>
        <v-icon left>mdi-delete</v-icon>
        <span>Delete images</span>
    </v-btn>
</template>

<script>
export default {
    name: 'DeleteImages',
    data() {
        return {
            deleting: false

        }
    },
    methods: {
        async deleteImages(){
            if(!confirm(`Delete images?`)) return
            try {
                this.deleting = false
                const url = '/images'
                // FOR NOW, IGNORING SKIP, LIMIT, ORDER and SORT 
                const { limit, skip, sort, order, ...params } = this.query  // eslint-disable-line no-unused-vars
                await this.axios.delete(url, {params})
                this.$emit('deleted')
            } catch (error) {
                alert('Deletion failed')
                console.error(error)
            } finally {
                this.deleting = false
            }
        }


    },
    computed: {
        query() {
            return this.$route.query
        },
    }

}
</script>
