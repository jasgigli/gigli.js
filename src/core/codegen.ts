import { ArrayNode, ASTNode, ObjectNode, PrimitiveNode } from './ast';

function isOptionalField(node: ASTNode): boolean {
  return (
    (node.type === 'primitive' || node.type === 'object' || node.type === 'array') &&
    !!(node as PrimitiveNode | ObjectNode | ArrayNode).optional
  );
}

// Convert a Validex AST to JSON Schema (basic types only)
export function generateJsonSchema(node: ASTNode): any {
  if (node.type === 'primitive') {
    let type: string = node.primitive;
    if (type === 'any') type = 'string';
    return { type };
  }
  if (node.type === 'object') {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    for (const key in node.fields) {
      properties[key] = generateJsonSchema(node.fields[key]);
      if (!isOptionalField(node.fields[key])) required.push(key);
    }
    return {
      type: 'object',
      properties,
      required: required.length ? required : undefined,
    };
  }
  if (node.type === 'array') {
    return {
      type: 'array',
      items: generateJsonSchema(node.element),
    };
  }
  // TODO: handle other node types
  return {};
}

// Convert a Validex AST to OpenAPI Schema (basic types only)
export function generateOpenApiSchema(node: ASTNode): any {
  // OpenAPI schema is very similar to JSON Schema for basic types
  return generateJsonSchema(node);
}
