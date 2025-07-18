import type { SyncValidator } from '../../types/validator/types';

const syncRules: Record<string, SyncValidator> = {};
const asyncRules: Record<string, (value: any, params?: Record<string, any>, context?: any) => Promise<boolean>> = {};

// Register built-in rules

syncRules['string'] = (state, p) => {
  const minValue = p?.min !== undefined ? p.min : p?.value;
  const maxValue = p?.max !== undefined ? p.max : p?.value;
  if (typeof state.value === 'string') {
    return (
      (!minValue || state.value.length >= Number(minValue)) &&
      (!maxValue || state.value.length <= Number(maxValue))
    );
  }
  if (typeof state.value === 'number') {
    return (
      (!minValue || state.value >= Number(minValue)) &&
      (!maxValue || state.value <= Number(maxValue))
    );
  }
  return false;
};
syncRules['number'] = (state, p) => typeof state.value === 'number' && (!p?.min || state.value >= Number(p.min)) && (!p?.max || state.value <= Number(p.max));
syncRules['email'] = (state) => typeof state.value === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.value);
syncRules['required'] = (state) => state.value !== undefined && state.value !== null && state.value !== '';
syncRules['boolean'] = (state) => typeof state.value === 'boolean';

// Register built-in test rule
syncRules['startsWithA'] = (state) => typeof state.value === 'string' && state.value.startsWith('A');

export function registerSyncRule(name: string, fn: SyncValidator) {
  syncRules[name] = fn;
}
export function getSyncRule(name: string): SyncValidator | undefined {
  return syncRules[name];
}

export function registerAsyncRule(
  name: string,
  fn: (
    value: any,
    params?: Record<string, any>,
    context?: any,
  ) => Promise<boolean>,
) {
  asyncRules[name] = fn;
}
export function getAsyncRule(name: string) {
  return asyncRules[name];
}
