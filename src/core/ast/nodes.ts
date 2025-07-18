// AST Node interfaces for Validex V4 Unified Runtime

// import type { ASTNode, PipelineStepNode } from '../../../types/ast/types';

export interface BaseASTNode {
  type: string;
}

export interface PrimitiveNode extends BaseASTNode {
  type: 'primitive';
  primitive: import('../../types/ast/types').PrimitiveType;
  rules?: RuleNode[];
  transformers?: TransformerNode[];
  optional?: boolean;
}

export interface ObjectNode extends BaseASTNode {
  type: 'object';
  fields: Record<string, ASTNode>;
  rules?: RuleNode[];
  transformers?: TransformerNode[];
  optional?: boolean;
}

export interface ArrayNode extends BaseASTNode {
  type: 'array';
  element: ASTNode;
  rules?: RuleNode[];
  transformers?: TransformerNode[];
  optional?: boolean;
}

export interface RuleNode extends BaseASTNode {
  type: 'rule';
  name: string;
  params?: Record<string, any>;
  message?: string;
  key?: string;
}

export interface TransformerNode extends BaseASTNode {
  type: 'transformer';
  name: string;
  params?: Record<string, any>;
}

export interface PipelineNode extends BaseASTNode {
  type: 'pipeline';
  steps: PipelineStepNode[];
}

export interface ClassNode extends BaseASTNode {
  type: 'class';
  className: string;
  fields: Record<string, ASTNode>;
  refinements?: Array<{ fn: (obj: any) => boolean; message?: string }>;
}

