"use strict";
// tests/validator.test.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ruleParser_1 = require("../src/core/parser/ruleParser");
const transformer_1 = require("../src/core/validator/transformer");
const validateChain_1 = require("../src/core/validator/validateChain");
describe('validator', () => {
    it('should validate string rules with transformers', () => __awaiter(void 0, void 0, void 0, function* () {
        const ruleString = 'trim=>string:min=3';
        const { transformers, rules } = (0, ruleParser_1.parse)(ruleString);
        let value = '  ab ';
        value = (0, transformer_1.applyTransformers)(value, transformers);
        const state = { key: 'test', value, data: { test: value }, context: {} };
        const result = yield (0, validateChain_1.validateChain)(state, rules);
        expect(result.valid).toBe(false);
        value = '  abc ';
        value = (0, transformer_1.applyTransformers)(value, transformers);
        const state2 = { key: 'test', value, data: { test: value }, context: {} };
        const result2 = yield (0, validateChain_1.validateChain)(state2, rules);
        expect(result2.valid).toBe(true);
    }));
});
