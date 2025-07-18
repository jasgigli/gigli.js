// tests/validator.test.ts

import { parse } from '../src/core/parser/ruleParser';
import { applyTransformers } from '../src/core/validator/transformer';
import { validateChain } from '../src/core/validator/validateChain';

describe('validator', () => {
  it('should validate string rules with transformers', async () => {
    const ruleString = 'trim=>string:min=3';
    const { transformers, rules } = parse(ruleString);
    let value = '  ab ';
    value = applyTransformers(value, transformers);
    const state = { key: 'test', value, data: { test: value }, context: {} };
    const result = await validateChain(state, rules);
    expect(result.valid).toBe(false);
    value = '  abc ';
    value = applyTransformers(value, transformers);
    const state2 = { key: 'test', value, data: { test: value }, context: {} };
    const result2 = await validateChain(state2, rules);
    expect(result2.valid).toBe(true);
  });
});
