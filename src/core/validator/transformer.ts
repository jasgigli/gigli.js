import type { Transformer } from "../../types/validator/types";
import { getTransformer as registryGetTransformer, registerTransformer as registryRegisterTransformer } from "../registry/transformerRegistry";

// Register built-in transformers using the singleton registry
registryRegisterTransformer('trim', (value) => (typeof value === "string" ? value.trim() : value));
registryRegisterTransformer('lower', (value) => (typeof value === "string" ? value.toLowerCase() : value));
registryRegisterTransformer('number', (value) => (value === null || value === "" ? value : Number(value)));
registryRegisterTransformer('upper', (value) => (typeof value === "string" ? value.toUpperCase() : value));
registryRegisterTransformer('capitalize', (value) => typeof value === "string" ? value.charAt(0).toUpperCase() + value.slice(1) : value);
registryRegisterTransformer('boolean', (value) => value === "true" || value === true ? true : value === "false" || value === false ? false : value);
registryRegisterTransformer('string', (value) => (value == null ? "" : String(value)));

export function registerTransformer(name: string, fn: Transformer) {
  registryRegisterTransformer(name, fn);
}

export function applyTransformers(value: any, transformerNames: string[]): any {
  let transformedValue = value;
  for (const name of transformerNames) {
    const transformerFn = registryGetTransformer(name);
    if (!transformerFn) throw new Error(`Unknown transformer: "${name}"`);
    transformedValue = transformerFn(transformedValue);
  }
  return transformedValue;
}

export function getTransformer(name: string) {
  return registryGetTransformer(name);
}
