import type { AsyncValidator } from '../../types/validator/types';

const asyncValidators: Record<string, AsyncValidator> = {};

export function registerAsyncRule(name: string, fn: AsyncValidator) {
  asyncValidators[name] = fn;
}

// Placeholder for validate to avoid circular dependency. This is only used for internal async rules like 'when'.
// Do not use in main validation paths.
const validate = (...args: any[]) => Promise.resolve({ isValid: true });

// Cross-field and context-aware rules
registerAsyncRule('equal', (state: any, params: any) => {
  if (params.field && params.field.startsWith('$')) {
    const fieldToCompare = params.field.substring(1);
    return Promise.resolve(state.value === state.data[fieldToCompare]);
  }
  return Promise.resolve(false);
});
registerAsyncRule('after', (state: any, params: any) => {
  if (params.field && params.field.startsWith('$')) {
    const fieldToCompare = params.field.substring(1);
    const dateToCompare = new Date(state.data[fieldToCompare]);
    const currentDate = new Date(state.value);
    return Promise.resolve(currentDate > dateToCompare);
  }
  return Promise.resolve(false);
});
registerAsyncRule('when', async (state: any, params: any) => {
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

export function getAsyncRule(name: string): AsyncValidator | undefined {
  return asyncValidators[name];
}
