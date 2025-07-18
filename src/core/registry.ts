// Unified registry for rules, transformers, and named definitions

const ruleDefinitions: Record<string, string> = {};
const syncRules: Record<string, (value: any, params?: Record<string, any>, context?: any) => boolean> = {};
const asyncRules: Record<string, (value: any, params?: Record<string, any>, context?: any) => Promise<boolean>> = {};
const transformers: Record<string, (value: any, params?: Record<string, any>) => any> = {};

// Named rule string definitions (portable strings)
export function define(name: string, ruleString: string) {
  if (ruleDefinitions[name]) {
    console.warn(`[Validex] Overwriting existing rule definition: "${name}"`);
  }
  ruleDefinitions[name] = ruleString;
}
export function getDefinition(name: string): string | undefined {
  return ruleDefinitions[name];
}

// Sync rule registration
export function registerSyncRule(name: string, fn: (value: any, params?: Record<string, any>, context?: any) => boolean) {
  syncRules[name] = fn;
}
export function getSyncRule(name: string) {
  return syncRules[name];
}

// Async rule registration
export function registerAsyncRule(name: string, fn: (value: any, params?: Record<string, any>, context?: any) => Promise<boolean>) {
  asyncRules[name] = fn;
}
export function getAsyncRule(name: string) {
  return asyncRules[name];
}

// Transformer registration
export function registerTransformer(name: string, fn: (value: any, params?: Record<string, any>) => any) {
  transformers[name] = fn;
}
export function getTransformer(name: string) {
  return transformers[name];
}

// Export all for unified use
export const registry = {
  define,
  getDefinition,
  registerSyncRule,
  getSyncRule,
  registerAsyncRule,
  getAsyncRule,
  registerTransformer,
  getTransformer,
};
