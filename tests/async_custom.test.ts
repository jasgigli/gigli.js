import { validateAST } from '../src/core/engine/validateAST';
import { registerAsyncRule, registerSyncRule } from '../src/core/registry/ruleRegistry';
import { registerTransformer } from '../src/core/registry/transformerRegistry';

describe('Async and Custom Rules/Transformers', () => {
  beforeAll(() => {
    // Register a custom sync rule
    registerSyncRule('startsWithA', (value) => typeof value === 'string' && value.startsWith('A'));
    // Register a custom async rule
    registerAsyncRule('isEvenAsync', async (value) => typeof value === 'number' && value % 2 === 0);
    // Register a custom transformer
    registerTransformer('reverse', (value) => typeof value === 'string' ? value.split('').reverse().join('') : value);
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
