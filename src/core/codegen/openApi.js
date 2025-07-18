"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenApiSchema = generateOpenApiSchema;
// import type { ASTNode } from '../../../types/ast/types';
const jsonSchema_1 = require("./jsonSchema");
function generateOpenApiSchema(node) {
    // OpenAPI schema is very similar to JSON Schema for basic types
    return (0, jsonSchema_1.generateJsonSchema)(node);
}
