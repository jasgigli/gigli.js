import { parse } from '../../core/parser';
import type { PrimitiveNode } from '../ast/nodes';
import { ArrayBuilder } from './arrayBuilder';
import { ObjectBuilder } from './objectBuilder';
import { PrimitiveBuilder } from './primitiveBuilder';

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
  from(ruleString: string) {
    const parsed = parse(ruleString);
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

export const v = new VBuilder();
export { ArrayBuilder, ObjectBuilder, PrimitiveBuilder };
