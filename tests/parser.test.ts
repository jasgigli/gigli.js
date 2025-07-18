
// tests/parser.test.ts

import { parse } from '../src/core/parser/ruleParser';

describe('parser', () => {
  it('should parse rule strings with transformers and rules', () => {
    const ruleString = 'trim=>lower=>string:min=3,max=10|email:message="Invalid email"';
    const parts = ruleString.split('|').map(p => p.trim());
    for (const part of parts) {
      const colonIdx = part.indexOf(':');
      let ruleName = part;
      let paramsString = '';
      if (colonIdx !== -1) {
        ruleName = part.slice(0, colonIdx).trim();
        paramsString = part.slice(colonIdx + 1).trim();
      }
      console.log('DEBUG RULE PART:', { ruleName, paramsString });
    }
    const result = parse(ruleString);
    console.log('PARSE DEBUG:', JSON.stringify(result, null, 2));
    expect(result.transformers).toEqual(['trim', 'lower']);
    expect(result.rules.length).toBe(2);
    expect(result.rules[0].rule).toBe('string');
    expect(result.rules[0].params).toEqual({ min: '3', max: '10' });
    expect(result.rules[1].rule).toBe('email');
    expect(result.rules[1].customMessage).toBe('Invalid email');
  });
});
