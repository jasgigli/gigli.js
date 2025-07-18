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
exports.registerAsyncRule = registerAsyncRule;
exports.getAsyncRule = getAsyncRule;
const asyncValidators = {};
function registerAsyncRule(name, fn) {
    asyncValidators[name] = fn;
}
// Placeholder for validate to avoid circular dependency. This is only used for internal async rules like 'when'.
// Do not use in main validation paths.
const validate = (...args) => Promise.resolve({ isValid: true });
// Cross-field and context-aware rules
registerAsyncRule("equal", (state, params) => {
    if (params.field && params.field.startsWith("$")) {
        const fieldToCompare = params.field.substring(1);
        return Promise.resolve(state.value === state.data[fieldToCompare]);
    }
    return Promise.resolve(false);
});
registerAsyncRule("after", (state, params) => {
    if (params.field && params.field.startsWith("$")) {
        const fieldToCompare = params.field.substring(1);
        const dateToCompare = new Date(state.data[fieldToCompare]);
        const currentDate = new Date(state.value);
        return Promise.resolve(currentDate > dateToCompare);
    }
    return Promise.resolve(false);
});
registerAsyncRule("when", (state, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { field, is, then, otherwise } = params;
    if (!field || !is)
        return true;
    const targetField = field.startsWith("$") ? field.substring(1) : field;
    const conditionValue = state.data[targetField];
    const conditionResult = yield validate({ temp: conditionValue }, { temp: is }, { context: state.context });
    if (conditionResult.isValid) {
        if (!then)
            return true;
        const thenResult = yield validate({ temp: state.value }, { temp: then }, { context: state.context });
        return thenResult.isValid;
    }
    else {
        if (!otherwise)
            return true;
        const otherwiseResult = yield validate({ temp: state.value }, { temp: otherwise }, { context: state.context });
        return otherwiseResult.isValid;
    }
}));
function getAsyncRule(name) {
    return asyncValidators[name];
}
