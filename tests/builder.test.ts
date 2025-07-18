import { v } from '../src/core/builder';
import { validateAST } from '../src/core/engine/validateAST';

describe('Builder API', () => {
  it('should build a string schema and validate', async () => {
    const schema = v.string().min(3).max(10);
    const ast = schema.toAST();
    expect(ast.primitive).toBe('string');
    const valid = await validateAST(ast, 'hello');
    expect(valid.valid).toBe(true);
    const invalid = await validateAST(ast, 'hi');
    expect(invalid.valid).toBe(false);
  });

  it('should build a number schema and validate', async () => {
    const schema = v.number().min(5).max(10);
    const ast = schema.toAST();
    expect(ast.primitive).toBe('number');
    expect((await validateAST(ast, 7)).valid).toBe(true);
    expect((await validateAST(ast, 3)).valid).toBe(false);
  });

  it('should build an object schema and validate', async () => {
    const schema = v.object({
      name: v.string().min(2),
      age: v.number().min(18),
    });
    const ast = schema.toAST();
    expect(ast.type).toBe('object');
    expect((await validateAST(ast, { name: 'Joe', age: 20 })).valid).toBe(true);
    expect((await validateAST(ast, { name: 'J', age: 20 })).valid).toBe(false);
  });

  it('should build an array schema and validate', async () => {
    const schema = v.array(v.string().min(2));
    const ast = schema.toAST();
    expect(ast.type).toBe('array');
    expect((await validateAST(ast, ['ab', 'cd'])).valid).toBe(true);
    expect((await validateAST(ast, ['a', 'cd'])).valid).toBe(false);
  });

  it('should build from rule string', async () => {
    const schema = v.from('trim=>string:min=3');
    const ast = schema.toAST();
    expect(ast.type).toBe('primitive');
    expect(ast.transformers?.[0].name).toBe('trim');
    expect(ast.rules?.[0]?.name).toBe('string');
    expect(ast.rules?.[0]?.params?.min).toBe('3');
    expect((await validateAST(ast, '  abc ')).valid).toBe(true);
    expect((await validateAST(ast, '  ab ')).valid).toBe(false);
  });
});
