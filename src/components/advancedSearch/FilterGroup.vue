<template>
  <v-card variant="flat" class="filter-group p-0">
    <!-- LEFT RAIL WITH OP SELECTOR -->
    <div class="rail">
      <div class="rail-line"></div>
      <div class="rail-dot rail-dot--top"></div>
      <div class="rail-dot rail-dot--bottom"></div>

      <v-menu offset-y left transition="fade-transition">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" size="small" class="op-pill">
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
      <v-btn
        class="rail-button-top"
        size="xsmall"
        variant="text"
        @click="$emit('remove')"
        icon="mdi-delete"
      >
      </v-btn>
    </div>

    <v-card-text>
      <div
        v-for="(child, idx) in internalGroup.children"
        :key="idx"
        class="pt-2"
      >
        <!-- Condition -->
        <v-row v-if="child.type === 'condition'" align="center">
          <v-col>
            <v-combobox
              :items="fieldsAll"
              v-model="child.key"
              label="Field"
              @change="emitChange"
              variant="underlined"
            />
          </v-col>
          <v-col cols="auto" class="px-3">
            <v-switch
              v-model="child.not"
              color="primary"
              label="NOT"
              @update:model-value="emitChange"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="child.value"
              label="Value"
              @input="emitChange"
              variant="underlined"
            />
          </v-col>
          <v-col cols="auto">
            <v-select
              :items="['string', 'number']"
              v-model="child.valueType"
              label="Type"
              @change="emitChange"
              style="max-width: 100px"
              variant="underlined"
            />
          </v-col>
          <v-col cols="auto">
            <v-btn @click="removeChild(idx)" variant="text" icon="mdi-delete" />
          </v-col>
        </v-row>

        <!-- Subgroup (recursive) -->
        <FilterGroup
          v-else-if="child.type === 'group'"
          v-model="internalGroup.children[idx] as Group"
          :fields-all="fieldsAll"
          :is-root="false"
          @input="emitChange"
          @remove="removeChild(idx)"
        />
      </div>

      <v-row class="mt-1">
        <v-col cols="auto" v-if="isRoot">
          <v-btn small color="primary" @click="addSubgroup">
            <v-icon left>mdi-plus</v-icon> Group
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn small color="primary" @click="addFilter">
            <v-icon left>mdi-plus</v-icon> Filter
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import type { Group } from "@/utils/interface";
import { ref, watch } from "vue";

const model = defineModel<Group>({ required: true });

const props = defineProps<{
  fieldsAll: any[];
  isRoot?: boolean;
}>();

const emit = defineEmits<{
  (e: "remove"): void;
}>();

function makeGroup(op = "AND"): Group {
  return { type: "group", op, children: [] };
}

function copyGroup(obj?: Group): Group {
  return JSON.parse(JSON.stringify(obj ?? makeGroup()));
}

const internalGroup = ref(copyGroup(model.value || makeGroup()));

function emitChange() {
  model.value = internalGroup.value;
}

function tryPrune() {
  if (
    !props.isRoot &&
    (!internalGroup.value.children || internalGroup.value.children.length === 0)
  ) {
    emit("remove");
    return;
  }
  emitChange();
}

function updateOp(item: string) {
  internalGroup.value.op = item;
  emitChange();
}

function addFilter() {
  internalGroup.value.children.push({
    type: "condition",
    key: "",
    value: "",
    not: false,
    valueType: "string",
  });
  emitChange();
}

function addSubgroup() {
  internalGroup.value.children.push({
    ...makeGroup(),
    children: [
      {
        type: "condition",
        key: "",
        value: "",
        not: false,
        valueType: "string",
      },
    ],
  });
  emitChange();
}

function removeChild(idx: number) {
  if (!Array.isArray(internalGroup.value.children)) return;
  internalGroup.value.children.splice(idx, 1);
  tryPrune();
}
watch(
  () => model.value,
  (newVal) => {
    if (newVal && newVal !== internalGroup.value) {
      internalGroup.value = copyGroup(newVal);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.filter-group {
  position: relative;
  padding-left: 65px;
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
  top: 40%;
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
  left: 40px;
  top: 5px;
}
</style>
