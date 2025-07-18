// Types for validator module

export interface ValidationState {
  key: string;
  value: any;
  data: Record<string, any>;
  context: Record<string, any>;
}

export type SyncValidator = (state: ValidationState, params: Record<string, string>) => boolean;
export type AsyncValidator = (state: ValidationState, params: Record<string, string>) => Promise<boolean>;
export type Transformer = (value: any) => any;
