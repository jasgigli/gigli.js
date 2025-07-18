// AST type aliases for Validex V4 Unified Runtime

export type PrimitiveType = 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array' | 'any';

import type { ArrayNode, ClassNode, ObjectNode, PipelineNode, PrimitiveNode, RuleNode, TransformerNode } from '../../../core/ast/nodes';

export type PipelineStepNode =
  | { type: 'transform'; fn: TransformerNode | ((value: any) => any) }
  | { type: 'validate'; schema: ASTNode }
  | { type: 'refine'; fn: (value: any) => boolean; message?: string }
  | { type: 'dispatch'; field: string; cases: Record<string, ASTNode> }
  | { type: 'effect'; onSuccess?: (trace: any) => void; onFailure?: (trace: any) => void };

export type ASTNode =
  | PrimitiveNode
  | ObjectNode
  | ArrayNode
  | RuleNode
  | TransformerNode
  | PipelineNode
  | ClassNode;
