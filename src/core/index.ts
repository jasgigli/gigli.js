// Modular core exports for Validex

// Types
export type { ValidationOptions, ValidationResult, ValidationSchema } from '../types/validator/types';

// Parser
export { parse } from './parser/ruleParser';

// Registry
export { define, getDefinition } from './registry/definitionRegistry';
export { getAsyncRule, getSyncRule, registerAsyncRule, registerSyncRule } from './registry/ruleRegistry';
export { getTransformer, registerTransformer } from './registry/transformerRegistry';

// Validator
export { applyTransformers } from './validator/transformer';
export { validateChain } from './validator/validateChain';

// Engine
export { validateAST } from './engine/validateAST';

// Codegen
export { generateJsonSchema } from './codegen/jsonSchema';
export { generateOpenApiSchema } from './codegen/openApi';

// Analyze
export { analyzeSchema } from './analyze/analyzeSchema';

// Decorators
export { getClassAST, Refine, Rule, ValidatedModel } from './decorators/validatedModel';

// Builder
export { ArrayBuilder, ObjectBuilder, PrimitiveBuilder, v, VBuilder } from './builder';

