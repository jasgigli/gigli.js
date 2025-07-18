import type { ArrayNode } from '../ast/nodes';

export class ArrayBuilder {
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
