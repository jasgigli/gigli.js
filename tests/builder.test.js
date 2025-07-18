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
const builder_1 = require("../src/core/builder");
const validateAST_1 = require("../src/core/engine/validateAST");
describe('Builder API', () => {
    it('should build a string schema and validate', () => __awaiter(void 0, void 0, void 0, function* () {
        const schema = builder_1.v.string().min(3).max(10);
        const ast = schema.toAST();
        expect(ast.primitive).toBe('string');
        const valid = yield (0, validateAST_1.validateAST)(ast, 'hello');
        expect(valid.valid).toBe(true);
        const invalid = yield (0, validateAST_1.validateAST)(ast, 'hi');
        expect(invalid.valid).toBe(false);
    }));
    it('should build a number schema and validate', () => __awaiter(void 0, void 0, void 0, function* () {
        const schema = builder_1.v.number().min(5).max(10);
        const ast = schema.toAST();
        expect(ast.primitive).toBe('number');
        expect((yield (0, validateAST_1.validateAST)(ast, 7)).valid).toBe(true);
        expect((yield (0, validateAST_1.validateAST)(ast, 3)).valid).toBe(false);
    }));
    it('should build an object schema and validate', () => __awaiter(void 0, void 0, void 0, function* () {
        const schema = builder_1.v.object({
            name: builder_1.v.string().min(2),
            age: builder_1.v.number().min(18),
        });
        const ast = schema.toAST();
        expect(ast.type).toBe('object');
        expect((yield (0, validateAST_1.validateAST)(ast, { name: 'Joe', age: 20 })).valid).toBe(true);
        expect((yield (0, validateAST_1.validateAST)(ast, { name: 'J', age: 20 })).valid).toBe(false);
    }));
    it('should build an array schema and validate', () => __awaiter(void 0, void 0, void 0, function* () {
        const schema = builder_1.v.array(builder_1.v.string().min(2));
        const ast = schema.toAST();
        expect(ast.type).toBe('array');
        expect((yield (0, validateAST_1.validateAST)(ast, ['ab', 'cd'])).valid).toBe(true);
        expect((yield (0, validateAST_1.validateAST)(ast, ['a', 'cd'])).valid).toBe(false);
    }));
    it('should build from rule string', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const schema = builder_1.v.from('trim=>string:min=3');
        const ast = schema.toAST();
        expect(ast.type).toBe('primitive');
        expect((_a = ast.transformers) === null || _a === void 0 ? void 0 : _a[0].name).toBe('trim');
        expect((_c = (_b = ast.rules) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.name).toBe('string');
        expect((_f = (_e = (_d = ast.rules) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.params) === null || _f === void 0 ? void 0 : _f.min).toBe('3');
        expect((yield (0, validateAST_1.validateAST)(ast, '  abc ')).valid).toBe(true);
        expect((yield (0, validateAST_1.validateAST)(ast, '  ab ')).valid).toBe(false);
    }));
});
