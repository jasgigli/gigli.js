"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTransformer = registerTransformer;
exports.getTransformer = getTransformer;
const transformers = {};
// Register built-in transformers
transformers['trim'] = (value) => (typeof value === 'string' ? value.trim() : value);
transformers['lower'] = (value) => (typeof value === 'string' ? value.toLowerCase() : value);
transformers['number'] = (value) => (value === null || value === '' ? value : Number(value));
transformers['upper'] = (value) => (typeof value === 'string' ? value.toUpperCase() : value);
transformers['capitalize'] = (value) => typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value;
transformers['boolean'] = (value) => value === 'true' || value === true ? true : value === 'false' || value === false ? false : value;
transformers['string'] = (value) => (value == null ? '' : String(value));
transformers['reverse'] = (value) => typeof value === 'string' ? value.split('').reverse().join('') : value;
function registerTransformer(name, fn) {
    transformers[name] = fn;
}
function getTransformer(name) {
    return transformers[name];
}
