const transformers: Record<string, (value: any, params?: Record<string, any>) => any> = {};

// Register built-in transformers
transformers['trim'] = (value) => (typeof value === 'string' ? value.trim() : value);
transformers['lower'] = (value) => (typeof value === 'string' ? value.toLowerCase() : value);
transformers['number'] = (value) => (value === null || value === '' ? value : Number(value));
transformers['upper'] = (value) => (typeof value === 'string' ? value.toUpperCase() : value);
transformers['capitalize'] = (value) => typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value;
transformers['boolean'] = (value) => value === 'true' || value === true ? true : value === 'false' || value === false ? false : value;
transformers['string'] = (value) => (value == null ? '' : String(value));
transformers['reverse'] = (value) => typeof value === 'string' ? value.split('').reverse().join('') : value;

export function registerTransformer(
  name: string,
  fn: (value: any, params?: Record<string, any>) => any,
) {
  transformers[name] = fn;
}
export function getTransformer(name: string) {
  return transformers[name];
}
