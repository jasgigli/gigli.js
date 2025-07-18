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
exports.v = exports.ValidatedModel = void 0;
exports.Rule = Rule;
exports.Refine = Refine;
exports.getClassAST = getClassAST;
require("reflect-metadata");
const validateAST_1 = require("../engine/validateAST");
const RULES_KEY = Symbol("gigli.js:rules");
const REFINES_KEY = Symbol("gigli.js:refines");
function Rule(rule) {
    return function (target, propertyKey) {
        const rules = Reflect.getMetadata(RULES_KEY, target) || {};
        rules[propertyKey] = rule;
        Reflect.defineMetadata(RULES_KEY, rules, target);
    };
}
function Refine(fn, options) {
    return function (target) {
        const refines = Reflect.getMetadata(REFINES_KEY, target) || [];
        refines.push({ fn, message: options === null || options === void 0 ? void 0 : options.message });
        Reflect.defineMetadata(REFINES_KEY, refines, target);
    };
}
class ValidatedModel {
    static from(data) {
        const instance = new this();
        Object.assign(instance, data);
        // Synchronously call validate, but if it returns a Promise, throw an error to force migration to async
        const result = instance.validate();
        if (result && typeof result.then === "function") {
            throw new Error("Use fromAsync() for async validation");
        }
        return instance;
    }
    static fromAsync(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new this();
            Object.assign(instance, data);
            yield instance.validate();
            return instance;
        });
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            // Enhanced: Compile metadata to AST and validate using validateAST
            const ast = getClassAST(this.constructor);
            const result = yield (0, validateAST_1.validateAST)(ast, this);
            if (!result.valid) {
                const errorMsg = result.errors && result.errors.length > 0
                    ? result.errors.join("; ")
                    : "Validation failed";
                throw new Error(errorMsg);
            }
            return result;
        });
    }
}
exports.ValidatedModel = ValidatedModel;
function getClassAST(target) {
    const rules = Reflect.getMetadata(RULES_KEY, target.prototype) || {};
    const refines = Reflect.getMetadata(REFINES_KEY, target) || [];
    const fields = {};
    for (const key in rules) {
        const rule = rules[key];
        fields[key] = typeof rule.toAST === "function" ? rule.toAST() : rule;
    }
    return {
        type: "class",
        className: target.name,
        fields,
        refinements: refines,
    };
}
exports.v = { Rule, Refine };
