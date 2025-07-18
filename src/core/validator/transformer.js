"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTransformer = registerTransformer;
exports.applyTransformers = applyTransformers;
exports.getTransformer = getTransformer;
const transformers = {
    trim: (value) => (typeof value === 'string' ? value.trim() : value),
    lower: (value) => (typeof value === 'string' ? value.toLowerCase() : value),
    number: (value) => (value === null || value === '' ? value : Number(value)),
    upper: (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    capitalize: (value) => (typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value),
    boolean: (value) => (value === 'true' || value === true ? true : value === 'false' || value === false ? false : value),
    string: (value) => (value == null ? '' : String(value)),
};
function registerTransformer(name, fn) {
    transformers[name] = fn;
}
function applyTransformers(value, transformerNames) {
    let transformedValue = value;
    for (const name of transformerNames) {
        const transformerFn = transformers[name];
        if (!transformerFn)
            throw new Error(`Unknown transformer: "${name}"`);
        transformedValue = transformerFn(transformedValue);
    }
    return transformedValue;
}
function getTransformer(name) {
    return transformers[name];
}
