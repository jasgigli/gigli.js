"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.define = define;
exports.getDefinition = getDefinition;
const ruleDefinitions = {};
function define(name, ruleString) {
    if (ruleDefinitions[name]) {
        console.warn(`[gigli.js] Overwriting existing rule definition: "${name}"`);
    }
    ruleDefinitions[name] = ruleString;
}
function getDefinition(name) {
    return ruleDefinitions[name];
}
