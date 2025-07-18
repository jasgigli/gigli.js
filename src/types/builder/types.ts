import type { ArrayNode, ObjectNode, PrimitiveNode } from '../../core/ast/nodes';

export interface IPrimitiveBuilder {
  min(value: number): IPrimitiveBuilder;
  max(value: number): IPrimitiveBuilder;
  email(): IPrimitiveBuilder;
  optional(): IPrimitiveBuilder;
  transform(name: string, params?: Record<string, any>): IPrimitiveBuilder;
  rule(name: string, params?: Record<string, any>): IPrimitiveBuilder;
  toAST(): PrimitiveNode;
}

export interface IObjectBuilder {
  optional(): IObjectBuilder;
  toAST(): ObjectNode;
}

export interface IArrayBuilder {
  optional(): IArrayBuilder;
  toAST(): ArrayNode;
}

export interface IVBuilder {
  string(): IPrimitiveBuilder;
  number(): IPrimitiveBuilder;
  boolean(): IPrimitiveBuilder;
  date(): IPrimitiveBuilder;
  any(): IPrimitiveBuilder;
  object(fields: Record<string, IPrimitiveBuilder | IObjectBuilder | IArrayBuilder>): IObjectBuilder;
  array(element: IPrimitiveBuilder | IObjectBuilder | IArrayBuilder): IArrayBuilder;
  from(ruleString: string): { toAST(): PrimitiveNode };
}

// v is the main builder instance
export declare const v: IVBuilder;
