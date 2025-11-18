<template>
  <v-card variant="outlined" color="grey-lighten-1">
    <v-expansion-panels flat accordion>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <span>
            <v-icon left>mdi-magnify</v-icon>
            <span>Query settings</span>
          </span>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-form @submit.prevent="applyFilters">
            <v-row align="baseline">
              <v-col cols="">
                <DatePicker label="From" v-model="from" />
              </v-col>
              <v-col cols="">
                <DatePicker label="To" v-model="to" />
              </v-col>
            </v-row>

            <v-row class="mb-4" v-if="hasFilters && root">
              <v-col cols="12">
                <FilterGroup
                  v-model="root"
                  :fields-all="allFilters"
                  :is-root="true"
                  @remove="root = null"
                />
              </v-col>
            </v-row>

            <v-row class="mt-2" v-else>
              <v-col cols="auto">
                <v-btn color="primary" @click="addFirstFilter">
                  <v-icon left>mdi-plus</v-icon>
                  <span>Add filter</span>
                </v-btn>
              </v-col>
            </v-row>

            <v-row align="center">
              <v-col cols="auto">
                <v-switch label="Partial match" v-model="regex" hide-details />
              </v-col>

              <v-spacer />

              <v-col cols="auto">
                <v-btn color="primary" type="submit" :loading="loading">
                  <v-icon left>mdi-magnify</v-icon>
                  <span>Apply filters</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script setup lang="ts">
import type { Condition, Group } from "@/utils/interface";
import { ref, computed, onMounted } from "vue";

type FilterNode = Group | Condition;

const queryModel = defineModel<Record<string, any>>({ default: {} });

const root = ref<Group | null>(null);
const regex = ref(false);
const props = defineProps<{ fields?: string[]; loading?: boolean }>();

const allFilters = computed(() => {
  return ["file", "_id", ...(props.fields ?? [])];
});

const hasFilters = computed(() => {
  return !!(
    root.value &&
    Array.isArray(root.value.children) &&
    root.value.children.length
  );
});

const to = ref<string>(normalizeQueryValue(queryModel.value?.to as any) ?? "");
const from = ref<string>(
  normalizeQueryValue(queryModel.value?.from as any) ?? ""
);

onMounted(() => {
  loadFiltersFromQuery();
});

function makeGroup(op = "AND"): Group {
  return { type: "group", op, children: [] };
}

function isTopLevelField(key: string) {
  return key === "file" || key === "_id" || key === "time";
}

function toBackendKey(key: string) {
  return isTopLevelField(key) ? key : `data.${key}`;
}

function nodeToClause(node: FilterNode | null): any | null {
  if (!node) return null;

  if (node.type === "condition") {
    const { key, value, not, valueType } = node;
    if (!key || value === "") return null;
    const backendKey = toBackendKey(key);

    if (regex.value) {
      const regexObj = { $regex: String(value), $options: "i" };
      return not
        ? { [backendKey]: { $not: regexObj } }
        : { [backendKey]: regexObj };
    }

    const parsedValue = valueType === "number" ? Number(value) : value;

    return not
      ? { [backendKey]: { $ne: parsedValue } }
      : { [backendKey]: parsedValue };
  }

  if (node.type === "group") {
    const parts = node.children
      .map((n: FilterNode) => nodeToClause(n))
      .filter(Boolean);
    if (!parts.length) return null;

    return node.op === "OR" ? { $or: parts } : { $and: parts };
  }

  return null;
}

function buildFilterObject(): any | null {
  const clause = nodeToClause(root.value);
  return clause || null;
}

function shallowCompare(obj1: Record<string, any>, obj2: Record<string, any>) {
  const k1 = Object.keys(obj1);
  const k2 = Object.keys(obj2);
  if (k1.length !== k2.length) return false;
  return k1.every((key) => obj1[key] === obj2[key]);
}

function normalizeQueryValue(
  v: string | string[] | undefined | null
): string | undefined {
  if (v === undefined || v === null) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function makeCondition(keyRaw: string | undefined, val: any) {
  const key = keyRaw?.startsWith("data.") ? keyRaw.slice(5) : keyRaw;
  let not = false;
  let value: any = "";

  if (val && typeof val === "object") {
    if ("$ne" in val) {
      not = true;
      value = val.$ne;
    } else if ("$not" in val && val.$not?.$regex !== undefined) {
      not = true;
      value = val.$not.$regex;
    } else if ("$regex" in val) {
      value = val.$regex;
    } else if ("$eq" in val) {
      value = val.$eq;
    } else {
      value = "";
    }
  } else {
    value = val;
  }

  const valueType = typeof value === "number" ? "number" : "string";

  const condition: Condition = {
    type: "condition",
    key: String(key ?? ""),
    value: String(value ?? ""),
    not,
    valueType: valueType === "number" ? "number" : "string",
  };

  return condition;
}

function rehydrateTreeFromQuery(obj: any): Group {
  const hydrate = (node: any): Group => {
    if (!node || typeof node !== "object") {
      return makeGroup();
    }
    if (node.$and || node.$or) {
      const op = node.$or ? "OR" : "AND";
      const arr = node.$or || node.$and;
      return {
        ...makeGroup(op),
        children: arr.map((part: any) => {
          if (part.$and || part.$or) return hydrate(part);
          const key = Object.keys(part)[0] as string;
          return makeCondition(key, part[key]);
        }),
      };
    } else {
      // single condition object { k: v }
      const key = Object.keys(node)[0];
      if (!key) return makeGroup();
      return {
        ...makeGroup(),
        children: [makeCondition(key, node[key])],
      };
    }
  };
  return hydrate(obj);
}

function loadFiltersFromQuery() {
  const q = (queryModel.value || {}) as Record<string, any>;
  const regexQ = normalizeQueryValue(q.regex);
  const filterQ = normalizeQueryValue(q.filter);

  regex.value = regexQ === "true";

  if (filterQ) {
    try {
      const obj = JSON.parse(filterQ);
      root.value = rehydrateTreeFromQuery(obj);
      return;
    } catch (e) {
      console.log("Malformed filter in model; falling back to key=value", e);
    }
  }

  // fallback for single key=value filters
  const knownKeys = new Set([
    "to",
    "from",
    "sort",
    "order",
    "page",
    "limit",
    "skip",
    "regex",
    "filter",
  ]);
  const keys = Object.keys(q).filter((k) => !knownKeys.has(k));

  if (keys.length) {
    root.value = {
      ...makeGroup(),
      children: keys.map((key) => {
        const val = q[key];
        const v = Array.isArray(val) ? val[0] : val;
        return {
          type: "condition",
          key,
          value: String(v ?? ""),
          not: false,
          valueType: "string",
        } as Condition;
      }),
    };
  } else {
    root.value = null;
  }
}

function applyFilters() {
  const current = queryModel.value || {};

  const query: Record<string, any> = {
    to: to.value,
    from: from.value,
    limit: current.limit,
    skip: current.skip,
    sort: current.sort,
    order: current.order,
  };

  if (to.value) query.to = to.value;
  else delete query.to;

  if (from.value) query.from = from.value;
  else delete query.from;

  const filterObj = buildFilterObject();
  if (filterObj) query.filter = JSON.stringify(filterObj);
  else delete query.filter;

  if (regex.value) query.regex = "true";
  else delete query.regex;

  // prune empty values
  Object.keys(query).forEach((k) => {
    const val = query[k];
    if (val === undefined || val === null || val === "") delete query[k];
  });

  if (!shallowCompare(query, current as Record<string, any>)) {
    queryModel.value = query;
  }
}

function addFirstFilter() {
  if (!root.value) root.value = makeGroup("AND");
  if (!Array.isArray(root.value.children)) root.value.children = [];
  root.value.children.push({
    type: "condition",
    key: "",
    value: "",
    not: false,
    valueType: "string",
  } as Condition);
}
</script>
