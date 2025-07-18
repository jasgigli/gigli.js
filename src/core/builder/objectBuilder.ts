import type { ObjectNode } from '../ast/nodes';

export class ObjectBuilder {
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
