"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const validatedModel_1 = require("../src/core/decorators/validatedModel");
describe('Decorator API', () => {
    it('should validate a simple class with property rules', () => __awaiter(void 0, void 0, void 0, function* () {
        class User extends validatedModel_1.ValidatedModel {
        }
        __decorate([
            (0, validatedModel_1.Rule)({ toAST: () => ({ type: 'primitive', primitive: 'string', rules: [{ type: 'rule', name: 'string', params: { min: 3 } }] }) }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = User.from({ username: 'abc' });
        expect(user.username).toBe('abc');
        expect(() => User.from({ username: 'ab' })).toThrow();
    }));
    it('should validate with class-level refinement', () => __awaiter(void 0, void 0, void 0, function* () {
        let CreateUser = class CreateUser extends validatedModel_1.ValidatedModel {
        };
        __decorate([
            (0, validatedModel_1.Rule)({ toAST: () => ({ type: 'primitive', primitive: 'string', rules: [{ type: 'rule', name: 'string', params: { min: 8 } }] }) }),
            __metadata("design:type", String)
        ], CreateUser.prototype, "password", void 0);
        __decorate([
            (0, validatedModel_1.Rule)({ toAST: () => ({ type: 'primitive', primitive: 'string', rules: [{ type: 'rule', name: 'string', params: { min: 8 } }] }) }),
            __metadata("design:type", String)
        ], CreateUser.prototype, "passwordConfirm", void 0);
        CreateUser = __decorate([
            (0, validatedModel_1.Refine)((u) => u.password === u.passwordConfirm, { message: 'Passwords do not match' })
        ], CreateUser);
        expect(() => CreateUser.from({ password: 'abcdefgh', passwordConfirm: 'abcdefgh' })).not.toThrow();
        expect(() => CreateUser.from({ password: 'abcdefgh', passwordConfirm: 'abcdxxxx' })).toThrow(/Passwords do not match/);
    }));
    it('should generate correct AST from class', () => {
        class Product extends validatedModel_1.ValidatedModel {
        }
        __decorate([
            (0, validatedModel_1.Rule)({ toAST: () => ({ type: 'primitive', primitive: 'string', rules: [{ type: 'rule', name: 'string' }] }) }),
            __metadata("design:type", String)
        ], Product.prototype, "name", void 0);
        const ast = (0, validatedModel_1.getClassAST)(Product);
        expect(ast.type).toBe('class');
        expect(ast.fields.name.primitive).toBe('string');
    });
});
