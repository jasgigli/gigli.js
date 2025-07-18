export interface ValidationTraceStep {
  node: any;
  valueBefore: any;
  valueAfter?: any;
  ruleApplied?: string;
  result?: boolean;
  error?: string;
}

export interface ValidationTraceResult {
  valid: boolean;
  value: any;
  errors: string[];
  trace: ValidationTraceStep[];
}
