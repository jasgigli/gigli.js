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
// Temporary validate function for test compatibility
const src_1 = require("../src");
// Only keep the 'gigli.js top-level API' tests
describe('gigli.js top-level API', () => {
    it('should validate a simple object schema using top-level builder and validate', () => __awaiter(void 0, void 0, void 0, function* () {
        const userSchema = (0, src_1.object)({
            name: (0, src_1.string)().min(2),
            age: (0, src_1.number)().min(18),
        });
        const result = yield (0, src_1.validate)(userSchema, { name: 'Al', age: 20 });
        console.log('validate result:', result);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    }));
    it('should fail validation for invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
        const userSchema = (0, src_1.object)({
            name: (0, src_1.string)().min(2),
            age: (0, src_1.number)().min(18),
        });
        const result = yield (0, src_1.validate)(userSchema, { name: 'A', age: 15 });
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    }));
    it('should support array and boolean builders', () => __awaiter(void 0, void 0, void 0, function* () {
        const schema = (0, src_1.object)({
            tags: (0, src_1.array)((0, src_1.string)()),
            active: (0, src_1.boolean)(),
        });
        const result = yield (0, src_1.validate)(schema, { tags: ['a', 'b'], active: true });
        expect(result.valid).toBe(true);
    }));
});
