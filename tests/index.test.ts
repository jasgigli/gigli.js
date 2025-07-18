import { validate } from "../src";

describe('Validex Validator', () => {
  it('should pass a valid data object', () => {
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
    const result = validate(data, schema);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should fail an invalid data object and report errors', () => {
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
    const result = validate(data, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.age).toBeDefined();
  });

  it('should handle missing fields as validation failures', () => {
    const schema = {
      username: 'string:min=1'
    };
    const data = {}; // username is missing
    const result = validate(data, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBeDefined();
  });
});
