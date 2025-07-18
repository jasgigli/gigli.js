"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAsyncRule = exports.getAsyncRule = void 0;
exports.registerSyncRule = registerSyncRule;
exports.getSyncRule = getSyncRule;
const ruleRegistry_1 = require("../registry/ruleRegistry");
// Register built-in sync rules using the singleton registry
(0, ruleRegistry_1.registerSyncRule)("string", (state, p) => {
    const minValue = p.min !== undefined ? p.min : p.value;
    const maxValue = p.max !== undefined ? p.max : p.value;
    // Support both string and number for min/max
    if (typeof state.value === "string") {
        return ((!minValue || state.value.length >= Number(minValue)) &&
            (!maxValue || state.value.length <= Number(maxValue)));
    }
    if (typeof state.value === "number") {
        return ((!minValue || state.value >= Number(minValue)) &&
            (!maxValue || state.value <= Number(maxValue)));
    }
    return false;
});
(0, ruleRegistry_1.registerSyncRule)("number", (state, p) => typeof state.value === "number" &&
    (!p.min || state.value >= Number(p.min)) &&
    (!p.max || state.value <= Number(p.max)));
(0, ruleRegistry_1.registerSyncRule)("email", (state) => typeof state.value === "string" &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.value));
(0, ruleRegistry_1.registerSyncRule)("required", (state) => state.value !== undefined && state.value !== null && state.value !== "");
(0, ruleRegistry_1.registerSyncRule)("boolean", (state) => typeof state.value === "boolean");
// New built-in rules
(0, ruleRegistry_1.registerSyncRule)("minLength", (state, p) => typeof state.value === "string" && state.value.length >= Number(p.value));
(0, ruleRegistry_1.registerSyncRule)("maxLength", (state, p) => typeof state.value === "string" && state.value.length <= Number(p.value));
(0, ruleRegistry_1.registerSyncRule)("pattern", (state, p) => typeof state.value === "string" && new RegExp(p.value).test(state.value));
(0, ruleRegistry_1.registerSyncRule)("enum", (state, p) => Array.isArray(p.values)
    ? p.values.includes(state.value)
    : typeof p.values === "string" && p.values.split("|").includes(state.value));
(0, ruleRegistry_1.registerSyncRule)("integer", (state) => typeof state.value === "number" && Number.isInteger(state.value));
// Add min/max rules for both string and number
(0, ruleRegistry_1.registerSyncRule)("min", (state, p) => {
    const minValue = p.min !== undefined ? p.min : p.value;
    if (typeof state.value === "string")
        return state.value.length >= Number(minValue);
    if (typeof state.value === "number")
        return state.value >= Number(minValue);
    return false;
});
(0, ruleRegistry_1.registerSyncRule)("max", (state, p) => {
    const maxValue = p.max !== undefined ? p.max : p.value;
    if (typeof state.value === "string")
        return state.value.length <= Number(maxValue);
    if (typeof state.value === "number")
        return state.value <= Number(maxValue);
    return false;
});
(0, ruleRegistry_1.registerSyncRule)('startsWithA', (state) => typeof state.value === 'string' && state.value.startsWith('A'));
function registerSyncRule(name, fn) {
    (0, ruleRegistry_1.registerSyncRule)(name, fn);
}
function getSyncRule(name) {
    return (0, ruleRegistry_1.getSyncRule)(name);
}
var asyncValidator_1 = require("./asyncValidator");
Object.defineProperty(exports, "getAsyncRule", { enumerable: true, get: function () { return asyncValidator_1.getAsyncRule; } });
Object.defineProperty(exports, "registerAsyncRule", { enumerable: true, get: function () { return asyncValidator_1.registerAsyncRule; } });
