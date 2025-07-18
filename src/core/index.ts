import { parse } from './parser';
import { define, getDefinition } from './registry';
import { applyTransformers, registerAsyncRule, registerSyncRule, registerTransformer, validateChain } from './validator';

export type ValidationSchema = {
  [key: string]: string | ValidationSchema;
};

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, any>;
  validatedData: Record<string, any>;
}

export interface ValidationOptions {
  context?: Record<string, any>;
  i18n?: (key: string, params: Record<string, string>) => string;
}

export async function validate(
  data: Record<string, any>,
  schema: ValidationSchema,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  const errors: Record<string, any> = {};
  const validatedData: Record<string, any> = { ...data };
  let isValid = true;

  for (const key in schema) {
    let ruleString = schema[key];
    // --- Step 1: Resolve Custom Rule Definitions ---
    let seen = new Set<string>();
    while (typeof ruleString === 'string' && getDefinition(ruleString) && !seen.has(ruleString)) {
      seen.add(ruleString);
      ruleString = getDefinition(ruleString)!;
    }

    // --- Case 1: Sub-Schema (Nested Object) ---
    if (typeof ruleString === 'object') {
      if (typeof validatedData[key] !== 'object' || validatedData[key] === null) {
        isValid = false;
        errors[key] = 'Must be an object.';
        continue;
      }
      const subResult = await validate(validatedData[key], ruleString as ValidationSchema, options);
      validatedData[key] = subResult.validatedData;
      if (!subResult.isValid) {
        isValid = false;
        errors[key] = subResult.errors;
      }
      continue;
    }

    // --- Case 2: Rule String ---
    const { transformers, rules } = parse(ruleString as string);
    let value = validatedData[key];
    // Apply transformers
    try {
      value = applyTransformers(value, transformers);
      validatedData[key] = value;
    } catch (e: any) {
      isValid = false;
      errors[key] = e.message;
      continue;
    }

    // --- Step 3: Execute Rule Chain with Full Context ---
    const state = {
      key,
      value,
      data: validatedData,
      context: options.context || {},
    };
    const result = await validateChain(state, rules, options);
    if (!result.valid) {
      isValid = false;
      errors[key] = result.message || `Field '${key}' is invalid.`;
    }
  }

  return { isValid, errors, validatedData };
}

export { define, registerAsyncRule, registerSyncRule, registerTransformer };

