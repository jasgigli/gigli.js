import type { Transformer } from '../../../types/validator/types';

const transformers: Record<string, Transformer> = {
  trim: (value) => (typeof value === 'string' ? value.trim() : value),
  lower: (value) => (typeof value === 'string' ? value.toLowerCase() : value),
  number: (value) => (value === null || value === '' ? value : Number(value)),
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
