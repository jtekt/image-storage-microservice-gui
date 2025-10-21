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
            <span>{{ internalGroup.op }}</span>
            <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="item in ['AND', 'OR']"
            :key="item"
            @click="updateOp(item)"
          >
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <div class="rail-button" v-if="isRoot">
        <v-btn small color="primary" @click="addSubgroup">
          <v-icon left>mdi-plus</v-icon> Group
        </v-btn>
        <v-btn small color="primary" @click="addFilter" class="ml-3">
          <v-icon left>mdi-plus</v-icon> Filter
        </v-btn>
      </div>

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
      <div
        v-for="(child, idx) in internalGroup.children"
        :key="idx"
        :class="isRoot ? 'pt-0' : 'pt-6'"
      >
        <!-- Condition -->
        <v-row v-if="child.type === 'condition'" align="center">
          <v-col>
            <v-combobox
              :items="fieldsAll"
              v-model="child.key"
              label="Field"
              @change="emitChange"
            />
          </v-col>
          <v-col cols="auto" class="px-3">
            <v-switch v-model="child.not" label="NOT" @change="emitChange" />
          </v-col>
          <v-col>
            <v-text-field
              v-model="child.value"
              label="Value"
              @input="emitChange"
            />
          </v-col>
          <v-col cols="auto">
            <v-select
              :items="['string', 'number']"
              v-model="child.valueType"
              label="Type"
              @change="emitChange"
              style="max-width: 100px"
            />
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
          v-model="internalGroup.children[idx]"
          :fields-all="fieldsAll"
          :is-root="false"
          @input="emitChange"
          @remove="removeChild(idx)"
        />
      </div>

      <v-row class="mt-1" v-if="!isRoot">
        <v-col cols="auto">
          <v-btn small color="primary" @click="addFilter">
            <v-icon left>mdi-plus</v-icon> Filter
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
    value: { type: Object, required: true },
    fieldsAll: { type: Array, required: true },
    isRoot: { type: Boolean, default: false },
  },
  data() {
    return {
      internalGroup: this.copyGroup(
        this.value || { type: "group", op: "AND", children: [] }
      ),
    }
  },
  methods: {
    copyGroup(obj) {
      return JSON.parse(
        JSON.stringify(obj ?? { type: "group", op: "AND", children: [] })
      )
    },
    emitChange() {
      this.$emit("input", this.copyGroup(this.internalGroup))
    },
    updateOp(item) {
      this.internalGroup.op = item
      this.emitChange()
    },
    addFilter() {
      this.internalGroup.children.push({
        type: "condition",
        key: "",
        value: "",
        not: false,
        valueType: "string",
      })
      this.emitChange()
    },
    addSubgroup() {
      this.internalGroup.children.push({
        type: "group",
        op: "AND",
        children: [
          {
            type: "condition",
            key: "",
            value: "",
            not: false,
            valueType: "string",
          },
        ],
      })
      this.emitChange()
    },
    removeChild(idx) {
      if (!Array.isArray(this.internalGroup.children)) return
      this.internalGroup.children.splice(idx, 1)
      this.emitChange()
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.internalGroup = this.copyGroup(
          newVal || { type: "group", op: "AND", children: [] }
        )
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
.filter-group {
  position: relative;
  padding-left: 90px;
}

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

.rail-line {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 20px;
  border-left: 2px solid rgba(0, 0, 0, 0.12);
}

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

.op-pill {
  position: absolute;
  top: 45%;
  min-width: 56px;
  border-radius: 9999px !important;
  padding: 0 10px;
}

.rail-button {
  position: absolute;
  bottom: -35px;
  display: flex;
  left: -15px;
}
.rail-button-top {
  position: absolute;
  left: 45px;
  top: 10px;
}
</style>
