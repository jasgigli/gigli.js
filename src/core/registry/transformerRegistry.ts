const transformers: Record<
  string,
  (value: any, params?: Record<string, any>) => any
> = {};

export function registerTransformer(
  name: string,
  fn: (value: any, params?: Record<string, any>) => any,
) {
  transformers[name] = fn;
}
export function getTransformer(name: string) {
  return transformers[name];
}
