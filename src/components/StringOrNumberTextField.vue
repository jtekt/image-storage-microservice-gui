<!-- UNUSED becase query parameters are string regardless -->
<template>
  <div>
    <v-text-field
      v-if="valuIesNumber"
      :label="label"
      v-model.number="content"
    />
    <v-text-field v-else :label="label" v-model="content" />
  </div>
</template>

<script>
export default {
  name: "StringOrNumberTextField",
  props: ["value", "label"],
  data() {
    return {
      valuIesNumber: false,
    }
  },
  computed: {
    content: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit("input", newVal)
      },
    },
  },
}
</script>
