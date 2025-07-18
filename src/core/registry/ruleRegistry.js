"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSyncRule = registerSyncRule;
exports.getSyncRule = getSyncRule;
exports.registerAsyncRule = registerAsyncRule;
exports.getAsyncRule = getAsyncRule;
const syncRules = {};
const asyncRules = {};
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
