import type {
  IArrayBuilder,
  IObjectBuilder,
  IPrimitiveBuilder,
  IVBuilder,
} from "../../types/builder/types";
import type { PrimitiveNode } from "../ast/nodes";
import { parse } from "../parser/ruleParser";
import { ArrayBuilder } from "./arrayBuilder";
import { ObjectBuilder } from "./objectBuilder";
import { PrimitiveBuilder } from "./primitiveBuilder";

export class VBuilder implements IVBuilder {
  string(): IPrimitiveBuilder {
    return new PrimitiveBuilder("string");
  }
  number(): IPrimitiveBuilder {
    return new PrimitiveBuilder("number");
  }
  boolean(): IPrimitiveBuilder {
    return new PrimitiveBuilder("boolean");
  }
  date(): IPrimitiveBuilder {
    return new PrimitiveBuilder("date");
  }
  any(): IPrimitiveBuilder {
    return new PrimitiveBuilder("any");
  }
  object(
    fields: Record<string, IPrimitiveBuilder | IObjectBuilder | IArrayBuilder>,
  ): IObjectBuilder {
    return new ObjectBuilder(fields);
  }
  array(
    element: IPrimitiveBuilder | IObjectBuilder | IArrayBuilder,
  ): IArrayBuilder {
    return new ArrayBuilder(element);
  }
  from(ruleString: string): { toAST(): PrimitiveNode } {
    const parsed = parse(ruleString);
    const node: PrimitiveNode = {
      type: "primitive",
      primitive: "any",
      transformers: parsed.transformers.map((name: string) => ({
        type: "transformer",
        name,
      })),
      rules: parsed.rules.map((r: any) => ({
        type: "rule",
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

export const v: IVBuilder = new VBuilder();
export { ArrayBuilder, ObjectBuilder, PrimitiveBuilder };
