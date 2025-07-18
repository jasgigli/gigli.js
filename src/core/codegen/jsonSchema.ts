// import type { ASTNode } from '../../../types/ast/types';
import type { ArrayNode, ObjectNode, PrimitiveNode } from '../ast/nodes';

function isOptionalField(node: any): boolean {
  return (
    (node.type === 'primitive' || node.type === 'object' || node.type === 'array') &&
    !!(node as PrimitiveNode | ObjectNode | ArrayNode).optional
  );
}

export function generateJsonSchema(node: any): any {
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

export { isOptionalField };
