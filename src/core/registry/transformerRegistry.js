"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTransformer = registerTransformer;
exports.getTransformer = getTransformer;
const transformers = {};
function registerTransformer(name, fn) {
    transformers[name] = fn;
}
function getTransformer(name) {
    return transformers[name];
}
