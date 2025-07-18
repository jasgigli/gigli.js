"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSyncRule = registerSyncRule;
exports.getSyncRule = getSyncRule;
exports.registerAsyncRule = registerAsyncRule;
exports.getAsyncRule = getAsyncRule;
const syncRules = {};
const asyncRules = {};
// Register built-in rules
syncRules['string'] = (state, p) => {
    const minValue = (p === null || p === void 0 ? void 0 : p.min) !== undefined ? p.min : p === null || p === void 0 ? void 0 : p.value;
    const maxValue = (p === null || p === void 0 ? void 0 : p.max) !== undefined ? p.max : p === null || p === void 0 ? void 0 : p.value;
    if (typeof state.value === 'string') {
        return ((!minValue || state.value.length >= Number(minValue)) &&
            (!maxValue || state.value.length <= Number(maxValue)));
    }
    if (typeof state.value === 'number') {
        return ((!minValue || state.value >= Number(minValue)) &&
            (!maxValue || state.value <= Number(maxValue)));
    }
    return false;
};
syncRules['number'] = (state, p) => typeof state.value === 'number' && (!(p === null || p === void 0 ? void 0 : p.min) || state.value >= Number(p.min)) && (!(p === null || p === void 0 ? void 0 : p.max) || state.value <= Number(p.max));
syncRules['email'] = (state) => typeof state.value === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.value);
syncRules['required'] = (state) => state.value !== undefined && state.value !== null && state.value !== '';
syncRules['boolean'] = (state) => typeof state.value === 'boolean';
// Register built-in test rule
syncRules['startsWithA'] = (state) => typeof state.value === 'string' && state.value.startsWith('A');
function registerSyncRule(name, fn) {
    syncRules[name] = fn;
}
function getSyncRule(name) {
    return syncRules[name];
}
function registerAsyncRule(name, fn) {
    asyncRules[name] = fn;
}
function getAsyncRule(name) {
    return asyncRules[name];
}
