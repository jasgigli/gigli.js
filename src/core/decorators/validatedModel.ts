import 'reflect-metadata';
import type { ASTNode, ClassNode } from '../ast/nodes';

const RULES_KEY = Symbol('validex:rules');
const REFINES_KEY = Symbol('validex:refines');

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
    // Placeholder: In a full implementation, compile metadata to AST and validate
    // For now, just check that required fields are present
    const rules = (Reflect as any).getMetadata(RULES_KEY, this) || {};
    for (const key in rules) {
      if (this[key] === undefined) {
        throw new Error(`Missing required field: ${key}`);
      }
    }
    // TODO: Compile to AST and use validateAST for full validation
  }
}

export function getClassAST(target: any): ClassNode {
  const rules = (Reflect as any).getMetadata(RULES_KEY, target.prototype) || {};
  const refines = (Reflect as any).getMetadata(REFINES_KEY, target) || [];
  const fields: Record<string, ASTNode> = {};
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
