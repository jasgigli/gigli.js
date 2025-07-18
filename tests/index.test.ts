// Temporary validate function for test compatibility
import { parse } from '../src/core/parser/ruleParser';
import { getDefinition } from '../src/core/registry/definitionRegistry';
import { applyTransformers } from '../src/core/validator/transformer';
import { validateChain } from '../src/core/validator/validateChain';

async function validate(data: Record<string, any>, schema: Record<string, any>, options: any = {}) {
  const errors: Record<string, any> = {};
  const validatedData: Record<string, any> = { ...data };
  let isValid = true;

  for (const key in schema) {
    let ruleString = schema[key];
    let seen = new Set<string>();
    while (typeof ruleString === 'string' && getDefinition(ruleString) && !seen.has(ruleString)) {
      seen.add(ruleString);
      ruleString = getDefinition(ruleString)!;
    }
    if (typeof ruleString === 'object') {
      if (typeof validatedData[key] !== 'object' || validatedData[key] === null) {
        isValid = false;
        errors[key] = 'Must be an object.';
        continue;
      }
      const subResult = await validate(validatedData[key], ruleString, options);
      validatedData[key] = subResult.validatedData;
      if (!subResult.isValid) {
        isValid = false;
        errors[key] = subResult.errors;
      }
      continue;
    }
    const { transformers, rules } = parse(ruleString as string);
    let value = validatedData[key];
    try {
      value = applyTransformers(value, transformers);
      validatedData[key] = value;
    } catch (e: any) {
      isValid = false;
      errors[key] = e.message;
      continue;
    }
    const state = {
      key,
      value,
      data: validatedData,
      context: options.context || {},
    };
    const result = await validateChain(state, rules, options);
    if (!result.valid) {
      isValid = false;
      errors[key] = result.message || `Field '${key}' is invalid.`;
    }
  }
  return { isValid, errors, validatedData };
}

describe('Validex Validator', () => {
  it('should pass a valid data object', async () => {
    const schema = {
      name: 'string:min=3,max=50',
      age: 'number:min=18',
      role: 'enum:values=admin|user',
    };
    const data = {
      name: 'John Doe',
      age: 30,
      role: 'admin',
    };
    const result = await validate(data, schema);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should fail an invalid data object and report errors', async () => {
    const schema = {
      name: 'string:min=3',
      email: 'email',
      age: 'number:min=18',
    };
    const data = {
      name: 'Li', // Too short
      email: 'not-an-email', // Invalid format
      age: 17, // Too young
    };
    const result = await validate(data, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.age).toBeDefined();
  });

  it('should handle missing fields as validation failures', async () => {
    const schema = {
      username: 'string:min=1'
    };
    const data = {}; // username is missing
    const result = await validate(data, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBeDefined();
  });
});
