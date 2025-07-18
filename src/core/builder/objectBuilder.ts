import type { IObjectBuilder } from "../../types/builder/types";
import type { ObjectNode } from "../ast/nodes";
import { validate } from '../index';

export class ObjectBuilder implements IObjectBuilder {
  private node: ObjectNode;
  constructor(fields: Record<string, any>) {
    this.node = {
      type: "object",
      fields: Object.fromEntries(
        Object.entries(fields).map(([k, v]) => [
          k,
          typeof v.toAST === "function" ? v.toAST() : v,
        ]),
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
