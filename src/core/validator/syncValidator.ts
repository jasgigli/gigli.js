import type { SyncValidator } from "../../types/validator/types";
import { getSyncRule as registryGetSyncRule, registerSyncRule as registryRegisterSyncRule } from "../registry/ruleRegistry";

// Register built-in sync rules using the singleton registry
registryRegisterSyncRule(
  "string",
  (state: any, p: any) => {
    const minValue = p.min !== undefined ? p.min : p.value;
    const maxValue = p.max !== undefined ? p.max : p.value;
    // Support both string and number for min/max
    if (typeof state.value === "string") {
      return (
        (!minValue || state.value.length >= Number(minValue)) &&
        (!maxValue || state.value.length <= Number(maxValue))
      );
    }
    if (typeof state.value === "number") {
      return (
        (!minValue || state.value >= Number(minValue)) &&
        (!maxValue || state.value <= Number(maxValue))
      );
    }
    return false;
  }
);
registryRegisterSyncRule(
  "number",
  (state: any, p: any) =>
    typeof state.value === "number" &&
    (!p.min || state.value >= Number(p.min)) &&
    (!p.max || state.value <= Number(p.max)),
);
registryRegisterSyncRule(
  "email",
  (state: any) =>
    typeof state.value === "string" &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.value),
);
registryRegisterSyncRule(
  "required",
  (state: any) =>
    state.value !== undefined && state.value !== null && state.value !== "",
);
registryRegisterSyncRule("boolean", (state: any) => typeof state.value === "boolean");
// New built-in rules
registryRegisterSyncRule(
  "minLength",
  (state: any, p: any) =>
    typeof state.value === "string" && state.value.length >= Number(p.value),
);
registryRegisterSyncRule(
  "maxLength",
  (state: any, p: any) =>
    typeof state.value === "string" && state.value.length <= Number(p.value),
);
registryRegisterSyncRule(
  "pattern",
  (state: any, p: any) =>
    typeof state.value === "string" && new RegExp(p.value).test(state.value),
);
registryRegisterSyncRule("enum", (state: any, p: any) =>
  Array.isArray(p.values)
    ? p.values.includes(state.value)
    : typeof p.values === "string" && p.values.split("|").includes(state.value),
);
registryRegisterSyncRule(
  "integer",
  (state: any) =>
    typeof state.value === "number" && Number.isInteger(state.value),
);
// Add min/max rules for both string and number
registryRegisterSyncRule("min", (state: any, p: any) => {
  const minValue = p.min !== undefined ? p.min : p.value;
  if (typeof state.value === "string")
    return state.value.length >= Number(minValue);
  if (typeof state.value === "number") return state.value >= Number(minValue);
  return false;
});
registryRegisterSyncRule("max", (state: any, p: any) => {
  const maxValue = p.max !== undefined ? p.max : p.value;
  if (typeof state.value === "string")
    return state.value.length <= Number(maxValue);
  if (typeof state.value === "number") return state.value <= Number(maxValue);
  return false;
});
registryRegisterSyncRule('startsWithA', (state) => typeof state.value === 'string' && state.value.startsWith('A'));

export function registerSyncRule(name: string, fn: SyncValidator) {
  registryRegisterSyncRule(name, fn);
}

export function getSyncRule(name: string): SyncValidator | undefined {
  return registryGetSyncRule(name);
}

export { getAsyncRule, registerAsyncRule } from "./asyncValidator";

