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
  if (node.type === 'class') {
    // Treat class like object for JSON Schema
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
  if (node.type === 'pipeline') {
    // Output the schema for the first validate step, or a generic object
    const validateStep = node.steps.find((s: any) => s.type === 'validate');
    if (validateStep && validateStep.schema) {
      return generateJsonSchema(validateStep.schema);
    }
    return { type: 'object' };
  }
  return {};
}

export { isOptionalField };
