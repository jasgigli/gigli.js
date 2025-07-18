"use strict";
// Modular core exports for gigli.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.from = exports.any = exports.array = exports.date = exports.boolean = exports.number = exports.string = exports.object = exports.VBuilder = exports.v = exports.PrimitiveBuilder = exports.ObjectBuilder = exports.ArrayBuilder = exports.ValidatedModel = exports.Rule = exports.Refine = exports.getClassAST = exports.analyzeSchema = exports.generateOpenApiSchema = exports.generateJsonSchema = exports.validateAST = exports.validateChain = exports.applyTransformers = exports.registerTransformer = exports.getTransformer = exports.registerSyncRule = exports.registerAsyncRule = exports.getSyncRule = exports.getAsyncRule = exports.getDefinition = exports.define = exports.parse = void 0;
exports.validate = validate;
// Types
// export type { ValidationOptions, ValidationResult, ValidationSchema } from '../types/validator/types';
// Parser
var ruleParser_1 = require("./parser/ruleParser");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return ruleParser_1.parse; } });
// Registry
var definitionRegistry_1 = require("./registry/definitionRegistry");
Object.defineProperty(exports, "define", { enumerable: true, get: function () { return definitionRegistry_1.define; } });
Object.defineProperty(exports, "getDefinition", { enumerable: true, get: function () { return definitionRegistry_1.getDefinition; } });
var ruleRegistry_1 = require("./registry/ruleRegistry");
Object.defineProperty(exports, "getAsyncRule", { enumerable: true, get: function () { return ruleRegistry_1.getAsyncRule; } });
Object.defineProperty(exports, "getSyncRule", { enumerable: true, get: function () { return ruleRegistry_1.getSyncRule; } });
Object.defineProperty(exports, "registerAsyncRule", { enumerable: true, get: function () { return ruleRegistry_1.registerAsyncRule; } });
Object.defineProperty(exports, "registerSyncRule", { enumerable: true, get: function () { return ruleRegistry_1.registerSyncRule; } });
var transformerRegistry_1 = require("./registry/transformerRegistry");
Object.defineProperty(exports, "getTransformer", { enumerable: true, get: function () { return transformerRegistry_1.getTransformer; } });
Object.defineProperty(exports, "registerTransformer", { enumerable: true, get: function () { return transformerRegistry_1.registerTransformer; } });
// Validator
var transformer_1 = require("./validator/transformer");
Object.defineProperty(exports, "applyTransformers", { enumerable: true, get: function () { return transformer_1.applyTransformers; } });
var validateChain_1 = require("./validator/validateChain");
Object.defineProperty(exports, "validateChain", { enumerable: true, get: function () { return validateChain_1.validateChain; } });
// Engine
var validateAST_1 = require("./engine/validateAST");
Object.defineProperty(exports, "validateAST", { enumerable: true, get: function () { return validateAST_1.validateAST; } });
// Codegen
var jsonSchema_1 = require("./codegen/jsonSchema");
Object.defineProperty(exports, "generateJsonSchema", { enumerable: true, get: function () { return jsonSchema_1.generateJsonSchema; } });
var openApi_1 = require("./codegen/openApi");
Object.defineProperty(exports, "generateOpenApiSchema", { enumerable: true, get: function () { return openApi_1.generateOpenApiSchema; } });
// Analyze
var analyzeSchema_1 = require("./analyze/analyzeSchema");
Object.defineProperty(exports, "analyzeSchema", { enumerable: true, get: function () { return analyzeSchema_1.analyzeSchema; } });
// Decorators
var validatedModel_1 = require("./decorators/validatedModel");
Object.defineProperty(exports, "getClassAST", { enumerable: true, get: function () { return validatedModel_1.getClassAST; } });
Object.defineProperty(exports, "Refine", { enumerable: true, get: function () { return validatedModel_1.Refine; } });
Object.defineProperty(exports, "Rule", { enumerable: true, get: function () { return validatedModel_1.Rule; } });
Object.defineProperty(exports, "ValidatedModel", { enumerable: true, get: function () { return validatedModel_1.ValidatedModel; } });
// Builder
var builder_1 = require("./builder");
Object.defineProperty(exports, "ArrayBuilder", { enumerable: true, get: function () { return builder_1.ArrayBuilder; } });
Object.defineProperty(exports, "ObjectBuilder", { enumerable: true, get: function () { return builder_1.ObjectBuilder; } });
Object.defineProperty(exports, "PrimitiveBuilder", { enumerable: true, get: function () { return builder_1.PrimitiveBuilder; } });
Object.defineProperty(exports, "v", { enumerable: true, get: function () { return builder_1.v; } });
Object.defineProperty(exports, "VBuilder", { enumerable: true, get: function () { return builder_1.VBuilder; } });
// Top-level validate function for user convenience
const builder_2 = require("./builder");
const validateAST_2 = require("./engine/validateAST");
/**
 * Validate a value against a schema (AST or builder instance).
 * @param schema - The schema (AST or builder)
 * @param value - The value to validate
 * @param context - Optional context
 * @returns Validation result
 */
function validate(schema_1, value_1) {
    return __awaiter(this, arguments, void 0, function* (schema, value, context = {}) {
        const ast = typeof schema.toAST === 'function' ? schema.toAST() : schema;
        return (0, validateAST_2.validateAST)(ast, value, context);
    });
}
// Top-level builder exports for easier usage
exports.object = builder_2.v.object.bind(builder_2.v);
exports.string = builder_2.v.string.bind(builder_2.v);
exports.number = builder_2.v.number.bind(builder_2.v);
exports.boolean = builder_2.v.boolean.bind(builder_2.v);
exports.date = builder_2.v.date.bind(builder_2.v);
exports.array = builder_2.v.array.bind(builder_2.v);
exports.any = builder_2.v.any.bind(builder_2.v);
exports.from = builder_2.v.from.bind(builder_2.v);
