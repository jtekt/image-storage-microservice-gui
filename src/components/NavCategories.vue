<template>
  <v-list-group
    :value="true"
    no-action
    prepend-icon="mdi-folder-multiple-image"
  >
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>{{ field_name }}</v-list-item-title>
      </v-list-item-content>
    </template>

    <v-list-item
      v-for="(fieldValue, i) in fieldValues"
      :key="i"
      link
      exact
      :to="{
        name: 'images',
        query: {
          [field_name]: fieldValue,
          limit: 10,
          skip: 0,
          order: -1,
          sort: 'time',
        },
      }"
    >
      <v-list-item-icon>
        <v-icon>mdi-image-multiple</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{ fieldValue }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script>
const { VUE_APP_CATEGORIZER } = process.env

export default {
  name: "NavCategories",
  data: () => ({
    field_name: VUE_APP_CATEGORIZER,
    fieldValues: [],
  }),
  mounted() {
    this.get_field_values()
  },
  methods: {
    async get_field_values() {
      if (!this.field_name) return
      try {
        const { data } = await this.axios.get(`/fields/${this.field_name}`)
        this.fieldValues = data
      } catch (error) {
        console.error("Error fetching field values:", error)
      }
    },
  },
}
</script>
