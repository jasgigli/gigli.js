// Temporary validate function for test compatibility
import { array, boolean, number, object, string, validate } from '../src';

// Only keep the 'gigli.js top-level API' tests

describe('gigli.js top-level API', () => {
  it('should validate a simple object schema using top-level builder and validate', async () => {
    const userSchema = object({
      name: string().min(2),
      age: number().min(18),
    });
    const result = await validate(userSchema, { name: 'Al', age: 20 });
    console.log('validate result:', result);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should fail validation for invalid data', async () => {
    const userSchema = object({
      name: string().min(2),
      age: number().min(18),
    });
    const result = await validate(userSchema, { name: 'A', age: 15 });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should support array and boolean builders', async () => {
    const schema = object({
      tags: array(string()),
      active: boolean(),
    });
    const result = await validate(schema, { tags: ['a', 'b'], active: true });
    expect(result.valid).toBe(true);
  });
});
