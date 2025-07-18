import type { Transformer } from '../../types/validator/types';

const transformers: Record<string, Transformer> = {
  trim: (value) => (typeof value === 'string' ? value.trim() : value),
  lower: (value) => (typeof value === 'string' ? value.toLowerCase() : value),
  number: (value) => (value === null || value === '' ? value : Number(value)),
  upper: (value) => (typeof value === 'string' ? value.toUpperCase() : value),
  capitalize: (value) => (typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value),
  boolean: (value) => (value === 'true' || value === true ? true : value === 'false' || value === false ? false : value),
  string: (value) => (value == null ? '' : String(value)),
};

export function registerTransformer(name: string, fn: Transformer) {
  transformers[name] = fn;
}

export function applyTransformers(value: any, transformerNames: string[]): any {
  let transformedValue = value;
  for (const name of transformerNames) {
    const transformerFn = transformers[name];
    if (!transformerFn) throw new Error(`Unknown transformer: "${name}"`);
    transformedValue = transformerFn(transformedValue);
  }
  return transformedValue;
}

export function getTransformer(name: string) {
  return transformers[name];
}
