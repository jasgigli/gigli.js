import { Refine, Rule, ValidatedModel, getClassAST } from '../src/core/decorators/validatedModel';

describe('Decorator API', () => {
  it('should validate a simple class with property rules', async () => {
    class User extends ValidatedModel {
      // @ts-ignore
      @Rule({ toAST: () => ({ type: 'primitive', primitive: 'string', rules: [{ type: 'rule', name: 'string', params: { min: 3 } }] }) })
      username!: string;
    }
    // Use from() and expect error for invalid input
    const user = User.from({ username: 'abc' });
    expect(user.username).toBe('abc');
    expect(() => User.from({ username: 'ab' })).toThrow();
  });

  it('should validate with class-level refinement', async () => {
    // @ts-ignore
    @Refine((u: any) => u.password === u.passwordConfirm, { message: 'Passwords do not match' })
    class CreateUser extends ValidatedModel {
      // @ts-ignore
      @Rule({ toAST: () => ({ type: 'primitive', primitive: 'string', rules: [{ type: 'rule', name: 'string', params: { min: 8 } }] }) })
      password!: string;
      // @ts-ignore
      @Rule({ toAST: () => ({ type: 'primitive', primitive: 'string', rules: [{ type: 'rule', name: 'string', params: { min: 8 } }] }) })
      passwordConfirm!: string;
    }
    expect(() => CreateUser.from({ password: 'abcdefgh', passwordConfirm: 'abcdefgh' })).not.toThrow();
    expect(() => CreateUser.from({ password: 'abcdefgh', passwordConfirm: 'abcdxxxx' })).toThrow(/Passwords do not match/);
  });

  it('should generate correct AST from class', () => {
    class Product extends ValidatedModel {
      // @ts-ignore
      @Rule({ toAST: () => ({ type: 'primitive', primitive: 'string', rules: [{ type: 'rule', name: 'string' }] }) })
      name!: string;
    }
    const ast = getClassAST(Product);
    expect(ast.type).toBe('class');
    expect((ast.fields.name as any).primitive).toBe('string');
  });
});
