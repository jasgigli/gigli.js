// import type { ASTNode } from '../../../types/ast/types';
import { generateJsonSchema } from "./jsonSchema";

export function generateOpenApiSchema(node: any): any {
  // OpenAPI schema is very similar to JSON Schema for basic types
  return generateJsonSchema(node);
}
