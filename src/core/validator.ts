import { ParsedRule } from './parser';

export interface ValidationState {
  key: string;
  value: any;
  data: Record<string, any>;
  context: Record<string, any>;
}

type SyncValidator = (state: ValidationState, params: Record<string, string>) => boolean;
type AsyncValidator = (state: ValidationState, params: Record<string, string>) => Promise<boolean>;
type Transformer = (value: any) => any;

const syncValidators: Record<string, SyncValidator> = {};
const asyncValidators: Record<string, AsyncValidator> = {};
const transformers: Record<string, Transformer> = {
  trim: (value) => (typeof value === 'string' ? value.trim() : value),
  lower: (value) => (typeof value === 'string' ? value.toLowerCase() : value),
  number: (value) => (value === null || value === '' ? value : Number(value)),
};

export function registerSyncRule(name: string, fn: SyncValidator) {
  syncValidators[name] = fn;
}
export function registerAsyncRule(name: string, fn: AsyncValidator) {
  asyncValidators[name] = fn;
}
export function registerTransformer(name: string, fn: Transformer) {
  transformers[name] = fn;
}

// Built-in rules (examples, expand as needed)
registerSyncRule('string', (state, p) => typeof state.value === 'string' && (!p.min || state.value.length >= Number(p.min)) && (!p.max || state.value.length <= Number(p.max)));
registerSyncRule('number', (state, p) => typeof state.value === 'number' && (!p.min || state.value >= Number(p.min)) && (!p.max || state.value <= Number(p.max)));
registerSyncRule('email', (state) => typeof state.value === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.value));
registerSyncRule('required', (state) => state.value !== undefined && state.value !== null && state.value !== '');
registerSyncRule('boolean', (state) => typeof state.value === 'boolean');

// Cross-field and context-aware rules
registerAsyncRule('equal', (state, params) => {
  if (params.field && params.field.startsWith('$')) {
    const fieldToCompare = params.field.substring(1);
    return state.value === state.data[fieldToCompare];
  }
  return false;
});
registerAsyncRule('after', (state, params) => {
  if (params.field && params.field.startsWith('$')) {
    const fieldToCompare = params.field.substring(1);
    const dateToCompare = new Date(state.data[fieldToCompare]);
    const currentDate = new Date(state.value);
    return currentDate > dateToCompare;
  }
  return false;
});
registerAsyncRule('when', async (state, params) => {
  const { field, is, then, otherwise } = params;
  if (!field || !is) return true;
  const targetField = field.startsWith('$') ? field.substring(1) : field;
  const conditionValue = state.data[targetField];
  const conditionResult = await validate({ temp: conditionValue }, { temp: is }, { context: state.context });
  if (conditionResult.isValid) {
    if (!then) return true;
    const thenResult = await validate({ temp: state.value }, { temp: then }, { context: state.context });
    return thenResult.isValid;
  } else {
    if (!otherwise) return true;
    const otherwiseResult = await validate({ temp: state.value }, { temp: otherwise }, { context: state.context });
    return otherwiseResult.isValid;
  }
});

export function applyTransformers(value: any, transformerNames: string[]): any {
  let transformedValue = value;
  for (const name of transformerNames) {
    const transformerFn = transformers[name];
    if (!transformerFn) throw new Error(`Unknown transformer: "${name}"`);
    transformedValue = transformerFn(transformedValue);
  }
  return transformedValue;
}

export async function validateChain(state: ValidationState, rules: ParsedRule[], options: { i18n?: (key: string, params: Record<string, string>) => string } = {}): Promise<{ valid: boolean; message?: string }> {
  for (const parsedRule of rules) {
    const syncFn = syncValidators[parsedRule.rule];
    const asyncFn = asyncValidators[parsedRule.rule];
    let isValid = false;
    if (syncFn) {
      isValid = syncFn(state, parsedRule.params);
    } else if (asyncFn) {
      isValid = await asyncFn(state, parsedRule.params);
    } else {
      throw new Error(`Unknown validation rule: "${parsedRule.rule}"`);
    }
    if (!isValid) {
      if (parsedRule.customMessageKey && options.i18n) {
        return { valid: false, message: options.i18n(parsedRule.customMessageKey, parsedRule.params) };
      }
      if (parsedRule.customMessage) {
        return { valid: false, message: parsedRule.customMessage };
      }
      return { valid: false, message: `Field '${state.key}' failed rule '${parsedRule.rule}'.` };
    }
  }
  return { valid: true };
}

// Export registration functions for extensibility
export { registerAsyncRule, registerSyncRule, registerTransformer };

