"use strict";
// tests/parser.test.ts
Object.defineProperty(exports, "__esModule", { value: true });
const ruleParser_1 = require("../src/core/parser/ruleParser");
describe('parser', () => {
    it('should parse rule strings with transformers and rules', () => {
        const ruleString = 'trim=>lower=>string:min=3,max=10|email:message="Invalid email"';
        const result = (0, ruleParser_1.parse)(ruleString);
        expect(result.transformers).toEqual(['trim', 'lower']);
        expect(result.rules.length).toBe(2);
        expect(result.rules[0].rule).toBe('string');
        expect(result.rules[0].params).toEqual({ min: '3', max: '10' });
        expect(result.rules[1].rule).toBe('email');
        expect(result.rules[1].customMessage).toBe('Invalid email');
    });
});
