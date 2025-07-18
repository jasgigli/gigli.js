import 'reflect-metadata';
import type { ClassNode } from '../ast/nodes';
import { validateAST } from '../engine/validateAST';

const RULES_KEY = Symbol('gigli.js:rules');
const REFINES_KEY = Symbol('gigli.js:refines');

export function Rule(rule: any) {
  return function (target: any, propertyKey: string) {
    const rules = (Reflect as any).getMetadata(RULES_KEY, target) || {};
    rules[propertyKey] = rule;
    (Reflect as any).defineMetadata(RULES_KEY, rules, target);
  };
}

export function Refine(fn: (obj: any) => boolean, options?: { message?: string }) {
  return function (target: any) {
    const refines = (Reflect as any).getMetadata(REFINES_KEY, target) || [];
    refines.push({ fn, message: options?.message });
    (Reflect as any).defineMetadata(REFINES_KEY, refines, target);
  };
}

export class ValidatedModel {
  [key: string]: any;
  static from<T extends typeof ValidatedModel>(this: T, data: any): InstanceType<T> {
    const instance = new this() as any;
    Object.assign(instance, data);
    instance.validate();
    return instance;
  }

  validate() {
    // Enhanced: Compile metadata to AST and validate using validateAST
    const ast = getClassAST(this.constructor);
    let result: any;
    (async () => {
      result = await validateAST(ast, this);
      if (!result.valid) {
        const errorMsg = result.errors && result.errors.length > 0 ? result.errors.join('; ') : 'Validation failed';
        throw new Error(errorMsg);
      }
    })();
    return result;
  }
}

export function getClassAST(target: any): ClassNode {
  const rules = (Reflect as any).getMetadata(RULES_KEY, target.prototype) || {};
  const refines = (Reflect as any).getMetadata(REFINES_KEY, target) || [];
  const fields: Record<string, any> = {};
  for (const key in rules) {
    const rule = rules[key];
    fields[key] = typeof rule.toAST === 'function' ? rule.toAST() : rule;
  }
  return {
    type: 'class',
    className: target.name,
    fields,
    refinements: refines,
  };
}

export const v = { Rule, Refine };
