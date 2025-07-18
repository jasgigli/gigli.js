const syncRules: Record<
  string,
  (value: any, params?: Record<string, any>, context?: any) => boolean
> = {};
const asyncRules: Record<
  string,
  (value: any, params?: Record<string, any>, context?: any) => Promise<boolean>
> = {};

export function registerSyncRule(
  name: string,
  fn: (value: any, params?: Record<string, any>, context?: any) => boolean,
) {
  syncRules[name] = fn;
}
export function getSyncRule(name: string) {
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
