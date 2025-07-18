"use strict";
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
const validateAST_1 = require("../src/core/engine/validateAST");
const ruleRegistry_1 = require("../src/core/registry/ruleRegistry");
const transformerRegistry_1 = require("../src/core/registry/transformerRegistry");
describe('Async and Custom Rules/Transformers', () => {
    beforeAll(() => {
        // Register a custom sync rule
        (0, ruleRegistry_1.registerSyncRule)('startsWithA', (value) => typeof value === 'string' && value.startsWith('A'));
        // Register a custom async rule
        (0, ruleRegistry_1.registerAsyncRule)('isEvenAsync', (value) => __awaiter(void 0, void 0, void 0, function* () { return typeof value === 'number' && value % 2 === 0; }));
        // Register a custom transformer
        (0, transformerRegistry_1.registerTransformer)('reverse', (value) => typeof value === 'string' ? value.split('').reverse().join('') : value);
    });
    it('should validate with a custom sync rule', () => __awaiter(void 0, void 0, void 0, function* () {
        const ast = {
            type: 'primitive',
            primitive: 'string',
            rules: [{ type: 'rule', name: 'startsWithA' }],
        };
        expect((yield (0, validateAST_1.validateAST)(ast, 'Apple')).valid).toBe(true);
        expect((yield (0, validateAST_1.validateAST)(ast, 'Banana')).valid).toBe(false);
    }));
    it('should validate with a custom async rule', () => __awaiter(void 0, void 0, void 0, function* () {
        const ast = {
            type: 'primitive',
            primitive: 'number',
            rules: [{ type: 'rule', name: 'isEvenAsync' }],
        };
        expect((yield (0, validateAST_1.validateAST)(ast, 4)).valid).toBe(true);
        expect((yield (0, validateAST_1.validateAST)(ast, 5)).valid).toBe(false);
    }));
    it('should apply a custom transformer', () => __awaiter(void 0, void 0, void 0, function* () {
        const ast = {
            type: 'primitive',
            primitive: 'string',
            transformers: [{ type: 'transformer', name: 'reverse' }],
            rules: [{ type: 'rule', name: 'startsWithA' }],
        };
        // 'elppA' reversed is 'Apple', which starts with 'A'
        expect((yield (0, validateAST_1.validateAST)(ast, 'elppA')).valid).toBe(true);
        expect((yield (0, validateAST_1.validateAST)(ast, 'ananab')).valid).toBe(false);
    }));
});
