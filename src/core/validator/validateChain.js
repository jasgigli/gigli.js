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
exports.validateChain = validateChain;
const ruleRegistry_1 = require("../registry/ruleRegistry");
const asyncValidator_1 = require("./asyncValidator");
function validateChain(state_1, rules_1) {
    return __awaiter(this, arguments, void 0, function* (state, rules, options = {}) {
        for (const parsedRule of rules) {
            const syncFn = (0, ruleRegistry_1.getSyncRule)(parsedRule.rule);
            const asyncFn = (0, asyncValidator_1.getAsyncRule)(parsedRule.rule);
            let isValid = false;
            if (syncFn) {
                isValid = syncFn(state, parsedRule.params);
            }
            else if (asyncFn) {
                isValid = yield asyncFn(state, parsedRule.params);
            }
            else {
                throw new Error(`Unknown validation rule: "${parsedRule.rule}"`);
            }
            if (!isValid) {
                if (parsedRule.customMessageKey && options.i18n) {
                    return {
                        valid: false,
                        message: options.i18n(parsedRule.customMessageKey, parsedRule.params),
                    };
                }
                if (parsedRule.customMessage) {
                    return { valid: false, message: parsedRule.customMessage };
                }
                return {
                    valid: false,
                    message: `Field '${state.key}' failed rule '${parsedRule.rule}'.`,
                };
            }
        }
        return { valid: true };
    });
}
