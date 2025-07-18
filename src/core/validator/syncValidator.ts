import type { SyncValidator } from '../../../types/validator/types';

const syncValidators: Record<string, SyncValidator> = {};

export function registerSyncRule(name: string, fn: SyncValidator) {
  syncValidators[name] = fn;
}

// Built-in rules (examples, expand as needed)
registerSyncRule('string', (state, p) => typeof state.value === 'string' && (!p.min || state.value.length >= Number(p.min)) && (!p.max || state.value.length <= Number(p.max)));
registerSyncRule('number', (state, p) => typeof state.value === 'number' && (!p.min || state.value >= Number(p.min)) && (!p.max || state.value <= Number(p.max)));
registerSyncRule('email', (state) => typeof state.value === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.value));
registerSyncRule('required', (state) => state.value !== undefined && state.value !== null && state.value !== '');
registerSyncRule('boolean', (state) => typeof state.value === 'boolean');

export function getSyncRule(name: string): SyncValidator | undefined {
  return syncValidators[name];
}
