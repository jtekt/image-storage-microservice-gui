<template>
  <v-card outlined>
    <v-card-title class="py-5 d-flex align-center">
      <div class="d-flex align-center">
        <v-chip small color="primary" text-color="white" class="mr-2">
          {{ isRoot ? "Group" : "Subgroup" }}
        </v-chip>
        <v-select
          dense
          hide-details
          style="max-width: 120px"
          :items="['AND', 'OR']"
          v-model="group.op"
          label="Operation"
        />
      </div>
      <v-spacer />
      <v-btn v-if="!isRoot" icon @click="$emit('remove')">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <div v-for="(child, idx) in group.children" :key="idx" class="pb-5">
        <!-- Condition -->
        <v-row v-if="child.type === 'condition'" align="center">
          <v-col cols="">
            <v-combobox :items="fieldsAll" v-model="child.key" label="Field" />
          </v-col>
          <v-col cols="">
            <v-text-field v-model="child.value" label="Value" />
          </v-col>
          <v-col cols="auto">
            <v-switch v-model="child.not" label="NOT" />
          </v-col>
          <v-col cols="auto">
            <v-btn icon @click="removeChild(idx)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Subgroup -->
        <FilterGroup
          v-else-if="child.type === 'group'"
          :group="child"
          :fields-all="fieldsAll"
          :is-root="false"
          @remove="removeChild(idx)"
        />
      </div>

      <v-row>
        <v-col cols="auto">
          <v-btn small color="primary" @click="addFilter">
            <v-icon left>mdi-plus</v-icon> Add Filter
          </v-btn>
        </v-col>
        <v-col cols="auto" v-if="isRoot">
          <v-btn small color="primary" @click="addSubgroup">
            <v-icon left>mdi-plus</v-icon> Add Subgroup
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "FilterGroup",
  props: {
    group: { type: Object, required: true },
    fieldsAll: { type: Array, required: true },
    isRoot: { type: Boolean, default: false },
  },
  methods: {
    addFilter() {
      this.group.children.push({
        type: "condition",
        key: "",
        value: "",
        not: false,
      })
    },
    addSubgroup() {
      this.group.children.push({
        type: "group",
        op: "AND",
        children: [
          {
            type: "condition",
            key: "",
            value: "",
            not: false,
          },
        ],
      })
    },
    removeChild(idx) {
      this.group.children.splice(idx, 1)
    },
  },
}
</script>
