<template>
  <v-card class="filter-group p-0" flat>
    <!-- LEFT RAIL WITH OP SELECTOR -->
    <div class="rail">
      <div class="rail-line"></div>
      <div class="rail-dot rail-dot--top"></div>
      <div class="rail-dot rail-dot--bottom"></div>

      <v-menu offset-y left transition="fade-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" small class="op-pill">
            <span>{{ group.op }}</span>
            <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="item in ['AND', 'OR']"
            :key="item"
            @click="group.op = item"
          >
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-if="isRoot"
        small
        color="primary"
        class="ml-2 rail-button"
        @click="addSubgroup"
      >
        <v-icon left>mdi-plus</v-icon> Group
      </v-btn>

      <v-btn
        v-if="!isRoot"
        class="rail-button-top"
        x-small
        @click="$emit('remove')"
      >
        <v-icon left>mdi-delete</v-icon>
        Delete
      </v-btn>
    </div>

    <!-- CONTENT -->
    <v-card-text>
      <div v-for="(child, idx) in group.children" :key="idx" class="pt-8">
        <!-- Condition -->
        <v-row v-if="child.type === 'condition'" align="center">
          <v-col>
            <v-combobox :items="fieldsAll" v-model="child.key" label="Field" />
          </v-col>
          <v-col>
            <v-text-field v-model="child.value" label="Value" />
          </v-col>
          <v-col cols="auto" class="px-3">
            <v-switch v-model="child.not" label="NOT" />
          </v-col>
          <v-col cols="auto">
            <v-btn icon @click="removeChild(idx)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Subgroup (recursive) -->
        <FilterGroup
          v-else-if="child.type === 'group'"
          :group="child"
          :fields-all="fieldsAll"
          :is-root="false"
          @remove="removeChild(idx)"
        />
      </div>

      <v-row class="mt-1" no-gutters>
        <v-col cols="auto">
          <v-btn small color="primary" @click="addFilter">
            <v-icon left>mdi-plus</v-icon> Add Filter
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
        children: [{ type: "condition", key: "", value: "", not: false }],
      })
    },
    removeChild(idx) {
      this.group.children.splice(idx, 1)
    },
  },
}
</script>

<style scoped>
/* space for the left rail and op pill */
.filter-group {
  position: relative;
  padding-left: 90px;
}

/* rail container */
.rail {
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 50px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* vertical line */
.rail-line {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 20px;
  border-left: 2px solid rgba(0, 0, 0, 0.12);
}

/* end dots */
.rail-dot {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid rgba(0, 0, 0, 0.12);
}
.rail-dot--top {
  top: 8px;
}
.rail-dot--bottom {
  bottom: 8px;
}

/* operator button (pill look via large radius) */
.op-pill {
  position: absolute;
  top: 45%;
  min-width: 56px;
  border-radius: 9999px !important;
  padding: 0 10px;
}

/* tiny label under the operator */
.rail-button {
  position: absolute;
  bottom: -25px;
}
.rail-button-top {
  position: absolute;
  left: 45px;
  top: 10px;
}
</style>
