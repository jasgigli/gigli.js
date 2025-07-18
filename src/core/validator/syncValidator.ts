import type { SyncValidator } from "../../types/validator/types";

const syncValidators: Record<string, SyncValidator> = {};

export function registerSyncRule(name: string, fn: SyncValidator) {
  syncValidators[name] = fn;
}

// Built-in rules (examples, expand as needed)
registerSyncRule(
  "string",
  (state: any, p: any) =>
    typeof state.value === "string" &&
    (!p.min || state.value.length >= Number(p.min)) &&
    (!p.max || state.value.length <= Number(p.max)),
);
registerSyncRule(
  "number",
  (state: any, p: any) =>
    typeof state.value === "number" &&
    (!p.min || state.value >= Number(p.min)) &&
    (!p.max || state.value <= Number(p.max)),
);
registerSyncRule(
  "email",
  (state: any) =>
    typeof state.value === "string" &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.value),
);
registerSyncRule(
  "required",
  (state: any) =>
    state.value !== undefined && state.value !== null && state.value !== "",
);
registerSyncRule("boolean", (state: any) => typeof state.value === "boolean");
// New built-in rules
registerSyncRule(
  "minLength",
  (state: any, p: any) =>
    typeof state.value === "string" && state.value.length >= Number(p.value),
);
registerSyncRule(
  "maxLength",
  (state: any, p: any) =>
    typeof state.value === "string" && state.value.length <= Number(p.value),
);
registerSyncRule(
  "pattern",
  (state: any, p: any) =>
    typeof state.value === "string" && new RegExp(p.value).test(state.value),
);
registerSyncRule("enum", (state: any, p: any) =>
  Array.isArray(p.values)
    ? p.values.includes(state.value)
    : typeof p.values === "string" && p.values.split("|").includes(state.value),
);
registerSyncRule(
  "integer",
  (state: any) =>
    typeof state.value === "number" && Number.isInteger(state.value),
);
// Add min/max rules for both string and number
registerSyncRule("min", (state: any, p: any) => {
  const minValue = p.min !== undefined ? p.min : p.value;
  if (typeof state.value === "string")
    return state.value.length >= Number(minValue);
  if (typeof state.value === "number") return state.value >= Number(minValue);
  return false;
});
registerSyncRule("max", (state: any, p: any) => {
  const maxValue = p.max !== undefined ? p.max : p.value;
  if (typeof state.value === "string")
    return state.value.length <= Number(maxValue);
  if (typeof state.value === "number") return state.value <= Number(maxValue);
  return false;
});

export function getSyncRule(name: string): SyncValidator | undefined {
  return syncValidators[name];
}

export { getAsyncRule, registerAsyncRule } from "./asyncValidator";

