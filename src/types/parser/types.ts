// Types for parser module

export interface ParsedRule {
  rule: string;
  params: Record<string, string>;
  customMessage?: string;
  customMessageKey?: string;
}

export interface ParsedValidation {
  transformers: string[];
  rules: ParsedRule[];
}
