import { ArrayNode, ObjectNode, PrimitiveNode, PrimitiveType } from './ast';
import { parse } from './parser';

// Builder API core
export class VBuilder {
  string() {
    return new PrimitiveBuilder('string');
  }
  number() {
    return new PrimitiveBuilder('number');
  }
  boolean() {
    return new PrimitiveBuilder('boolean');
  }
  date() {
    return new PrimitiveBuilder('date');
  }
  any() {
    return new PrimitiveBuilder('any');
  }
  object(fields: Record<string, any>) {
    return new ObjectBuilder(fields);
  }
  array(element: any) {
    return new ArrayBuilder(element);
  }
  // Portable string rule integration
  from(ruleString: string) {
    // Parse the rule string into transformers and rules
    const parsed = parse(ruleString);
    // For now, treat as a generic primitive (type 'any')
    const node: PrimitiveNode = {
      type: 'primitive',
      primitive: 'any',
      transformers: parsed.transformers.map(name => ({ type: 'transformer', name })),
      rules: parsed.rules.map(r => ({
        type: 'rule',
        name: r.rule,
        params: r.params,
        message: r.customMessage,
        key: r.customMessageKey,
      })),
    };
    return {
      toAST: () => node,
    };
  }
}

// Primitive builder
class PrimitiveBuilder {
  private node: PrimitiveNode;
  constructor(type: PrimitiveType) {
    this.node = { type: 'primitive', primitive: type };
  }
  min(value: number) {
    this.addRule('min', { value });
    return this;
  }
  max(value: number) {
    this.addRule('max', { value });
    return this;
  }
  email() {
    this.addRule('email');
    return this;
  }
  optional() {
    this.node.optional = true;
    return this;
  }
  transform(name: string, params?: Record<string, any>) {
    if (!this.node.transformers) this.node.transformers = [];
    this.node.transformers.push({ type: 'transformer', name, params });
    return this;
  }
  rule(name: string, params?: Record<string, any>) {
    this.addRule(name, params);
    return this;
  }
  private addRule(name: string, params?: Record<string, any>) {
    if (!this.node.rules) this.node.rules = [];
    this.node.rules.push({ type: 'rule', name, params });
  }
  toAST(): PrimitiveNode {
    return this.node;
  }
}

// Object builder
class ObjectBuilder {
  private node: ObjectNode;
  constructor(fields: Record<string, any>) {
    this.node = {
      type: 'object',
      fields: Object.fromEntries(
        Object.entries(fields).map(([k, v]) => [k, typeof v.toAST === 'function' ? v.toAST() : v])
      ),
    };
  }
  optional() {
    this.node.optional = true;
    return this;
  }
  toAST(): ObjectNode {
    return this.node;
  }
}

// Array builder
class ArrayBuilder {
  private node: ArrayNode;
  constructor(element: any) {
    this.node = {
      type: 'array',
      element: typeof element.toAST === 'function' ? element.toAST() : element,
    };
  }
  optional() {
    this.node.optional = true;
    return this;
  }
  toAST(): ArrayNode {
    return this.node;
  }
}

// Export a singleton instance for API usage
export const v = new VBuilder();
