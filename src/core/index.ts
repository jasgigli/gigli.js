// Modular core exports for gigli.js

// Types
// export type { ValidationOptions, ValidationResult, ValidationSchema } from '../types/validator/types';

// Parser
export { parse } from "./parser/ruleParser";

// Registry
export { define, getDefinition } from "./registry/definitionRegistry";
export {
  getAsyncRule,
  getSyncRule,
  registerAsyncRule,
  registerSyncRule,
} from "./validator/syncValidator";
export { getTransformer, registerTransformer } from "./validator/transformer";

// Validator
export { applyTransformers } from "./validator/transformer";
export { validateChain } from "./validator/validateChain";

// Engine
export { validateAST } from "./engine/validateAST";

// Codegen
export { generateJsonSchema } from "./codegen/jsonSchema";
export { generateOpenApiSchema } from "./codegen/openApi";

// Analyze
export { analyzeSchema } from "./analyze/analyzeSchema";

// Decorators
export {
  getClassAST,
  Refine,
  Rule,
  ValidatedModel,
} from "./decorators/validatedModel";

// Builder
export {
  ArrayBuilder,
  ObjectBuilder,
  PrimitiveBuilder,
  v,
  VBuilder,
} from "./builder";

// Top-level validate function for user convenience
import { v } from "./builder";
import { validateAST } from "./engine/validateAST";

/**
 * Validate a value against a schema (AST or builder instance).
 * @param schema - The schema (AST or builder)
 * @param value - The value to validate
 * @param context - Optional context
 * @returns Validation result
 */
export async function validate(schema: any, value: any, context: any = {}) {
  const ast = typeof schema.toAST === "function" ? schema.toAST() : schema;
  return validateAST(ast, value, context);
}

// Top-level builder exports for easier usage
export const object = v.object.bind(v);
export const string = v.string.bind(v);
export const number = v.number.bind(v);
export const boolean = v.boolean.bind(v);
export const date = v.date.bind(v);
export const array = v.array.bind(v);
export const any = v.any.bind(v);
export const from = v.from.bind(v);
