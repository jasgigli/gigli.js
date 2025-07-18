import type { IArrayBuilder } from "../../types/builder/types";
import type { ArrayNode } from "../ast/nodes";
import { validate } from '../index';

export class ArrayBuilder implements IArrayBuilder {
  private node: ArrayNode;
  constructor(element: any) {
    this.node = {
      type: "array",
      element: typeof element.toAST === "function" ? element.toAST() : element,
    };
  }
  optional() {
    this.node.optional = true;
    return this;
  }
  toAST(): ArrayNode {
    return this.node;
  }

  async safeParse(value: any) {
    const result = await validate(this, value);
    return {
      success: result.valid,
      data: result.value,
      error: result.valid ? null : result.errors,
    };
  }

  async parse(value: any) {
    const result = await validate(this, value);
    if (!result.valid) {
      throw new Error(result.errors.join('; '));
    }
    return result.value;
  }
}
