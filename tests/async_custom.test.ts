import { validateAST } from '../src/core/engine/validateAST';
import { registerAsyncRule } from '../src/core/validator/asyncValidator';
import { registerSyncRule } from '../src/core/validator/syncValidator';
import { registerTransformer } from '../src/core/validator/transformer';

describe('Async and Custom Rules/Transformers', () => {
  beforeAll(() => {
    // Register a custom sync rule
    registerSyncRule('startsWithA', (state) => typeof state.value === 'string' && state.value.startsWith('A'));
    // Register a custom async rule
    registerAsyncRule('isEvenAsync', async (state) => typeof state.value === 'number' && state.value % 2 === 0);
    // Register a custom transformer
    registerTransformer('reverse', (value) => typeof value === 'string' ? value.split('').reverse().join('') : value);
    // Debug output
    // eslint-disable-next-line no-console
    console.log('Custom rules and transformers registered for async_custom.test.ts');
  });

  it('should validate with a custom sync rule', async () => {
    const ast = {
      type: 'primitive',
      primitive: 'string',
      rules: [{ type: 'rule', name: 'startsWithA' }],
    };
    expect((await validateAST(ast, 'Apple')).valid).toBe(true);
    expect((await validateAST(ast, 'Banana')).valid).toBe(false);
  });

  it('should validate with a custom async rule', async () => {
    const ast = {
      type: 'primitive',
      primitive: 'number',
      rules: [{ type: 'rule', name: 'isEvenAsync' }],
    };
    expect((await validateAST(ast, 4)).valid).toBe(true);
    expect((await validateAST(ast, 5)).valid).toBe(false);
  });

  it('should apply a custom transformer', async () => {
    const ast = {
      type: 'primitive',
      primitive: 'string',
      transformers: [{ type: 'transformer', name: 'reverse' }],
      rules: [{ type: 'rule', name: 'startsWithA' }],
    };
    // 'elppA' reversed is 'Apple', which starts with 'A'
    expect((await validateAST(ast, 'elppA')).valid).toBe(true);
    expect((await validateAST(ast, 'ananab')).valid).toBe(false);
  });
});
