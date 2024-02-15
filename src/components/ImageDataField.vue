<template>
    <v-textarea
        filled
        :class="auto_grow ? 'field-compose-input' : ''"
        :rows="textarea_row"
        :row-height="20"
        v-model="data_string"
        no-resize
        :auto-grow="auto_grow"
        :error="!isJsonValid"
        :error-messages="!isJsonValid ? 'Invalid JSON' : ''"
    />
</template>
<script>
export default {
    name: 'ImageDataEditor',
    data() {
        return { data_string: this.value }
    },
    props: {
        value: String,
        textarea_row: {
            type: Number,
            default: 10,
        },
        auto_grow: {
            type: Boolean,
            default: true,
        },
    },
    watch: {
        data_string(newVal) {
            if (newVal.trim() === '') this.data_string = '{}'
            this.$emit('input', this.data_string)
        },
    },
    computed: {
        isJsonValid() {
            try {
                JSON.parse(this.data_string)
            } catch (e) {
                this.$emit('valid-input', false)
                return false
            }
            this.$emit('valid-input', true)
            return true
        },
    },
}
</script>
<style>
.field-compose-input {
    textarea {
        max-height: 300px !important;
        overflow: auto !important;
    }
}
</style>
