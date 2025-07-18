"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAsyncRule = exports.getAsyncRule = void 0;
exports.registerSyncRule = registerSyncRule;
exports.getSyncRule = getSyncRule;
const syncValidators = {};
function registerSyncRule(name, fn) {
    syncValidators[name] = fn;
}
// Built-in rules (examples, expand as needed)
registerSyncRule('string', (state, p) => typeof state.value === 'string' && (!p.min || state.value.length >= Number(p.min)) && (!p.max || state.value.length <= Number(p.max)));
registerSyncRule('number', (state, p) => typeof state.value === 'number' && (!p.min || state.value >= Number(p.min)) && (!p.max || state.value <= Number(p.max)));
registerSyncRule('email', (state) => typeof state.value === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.value));
registerSyncRule('required', (state) => state.value !== undefined && state.value !== null && state.value !== '');
registerSyncRule('boolean', (state) => typeof state.value === 'boolean');
// New built-in rules
registerSyncRule('minLength', (state, p) => typeof state.value === 'string' && state.value.length >= Number(p.value));
registerSyncRule('maxLength', (state, p) => typeof state.value === 'string' && state.value.length <= Number(p.value));
registerSyncRule('pattern', (state, p) => typeof state.value === 'string' && new RegExp(p.value).test(state.value));
registerSyncRule('enum', (state, p) => Array.isArray(p.values) ? p.values.includes(state.value) : typeof p.values === 'string' && p.values.split('|').includes(state.value));
registerSyncRule('integer', (state) => typeof state.value === 'number' && Number.isInteger(state.value));
// Add min/max rules for both string and number
registerSyncRule('min', (state, p) => {
    if (typeof state.value === 'string')
        return state.value.length >= Number(p.value);
    if (typeof state.value === 'number')
        return state.value >= Number(p.value);
    return false;
});
registerSyncRule('max', (state, p) => {
    if (typeof state.value === 'string')
        return state.value.length <= Number(p.value);
    if (typeof state.value === 'number')
        return state.value <= Number(p.value);
    return false;
});
function getSyncRule(name) {
    return syncValidators[name];
}
var asyncValidator_1 = require("./asyncValidator");
Object.defineProperty(exports, "getAsyncRule", { enumerable: true, get: function () { return asyncValidator_1.getAsyncRule; } });
Object.defineProperty(exports, "registerAsyncRule", { enumerable: true, get: function () { return asyncValidator_1.registerAsyncRule; } });
