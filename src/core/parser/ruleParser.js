"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = parse;
function parse(ruleString) {
    let transformersString = '';
    let rulesString = ruleString;
    if (ruleString.includes('=>')) {
        const parts = ruleString.split(/=>/);
        transformersString = parts.slice(0, -1).join('=>').trim();
        rulesString = parts.slice(-1)[0].trim();
    }
    const transformers = transformersString
        ? transformersString.split('=>').map(t => t.trim()).filter(Boolean)
        : [];
    const rules = rulesString.split('|').map(part => {
        part = part.trim();
        const [ruleName, paramsString] = part.split(':', 2);
        const params = {};
        let customMessage;
        let customMessageKey;
        if (paramsString) {
            // Use regex to handle quoted messages and keys
            // TODO: Complete paramRegex logic if needed
            // const paramRegex = /(
            // For now, skip param parsing
        }
        return { rule: ruleName, params, customMessage, customMessageKey };
    });
    return { transformers, rules };
}
