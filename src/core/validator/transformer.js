"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTransformer = registerTransformer;
exports.applyTransformers = applyTransformers;
exports.getTransformer = getTransformer;
const transformerRegistry_1 = require("../registry/transformerRegistry");
// Register built-in transformers using the singleton registry
(0, transformerRegistry_1.registerTransformer)('trim', (value) => (typeof value === "string" ? value.trim() : value));
(0, transformerRegistry_1.registerTransformer)('lower', (value) => (typeof value === "string" ? value.toLowerCase() : value));
(0, transformerRegistry_1.registerTransformer)('number', (value) => (value === null || value === "" ? value : Number(value)));
(0, transformerRegistry_1.registerTransformer)('upper', (value) => (typeof value === "string" ? value.toUpperCase() : value));
(0, transformerRegistry_1.registerTransformer)('capitalize', (value) => typeof value === "string" ? value.charAt(0).toUpperCase() + value.slice(1) : value);
(0, transformerRegistry_1.registerTransformer)('boolean', (value) => value === "true" || value === true ? true : value === "false" || value === false ? false : value);
(0, transformerRegistry_1.registerTransformer)('string', (value) => (value == null ? "" : String(value)));
function registerTransformer(name, fn) {
    (0, transformerRegistry_1.registerTransformer)(name, fn);
}
function applyTransformers(value, transformerNames) {
    let transformedValue = value;
    for (const name of transformerNames) {
        const transformerFn = (0, transformerRegistry_1.getTransformer)(name);
        if (!transformerFn)
            throw new Error(`Unknown transformer: "${name}"`);
        transformedValue = transformerFn(transformedValue);
    }
    return transformedValue;
}
function getTransformer(name) {
    return (0, transformerRegistry_1.getTransformer)(name);
}
