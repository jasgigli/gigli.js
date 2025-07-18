import type { ParsedRule, ParsedValidation } from '../../types/parser/types';

export function parse(ruleString: string): ParsedValidation {
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

  const rules: ParsedRule[] = rulesString.split('|').map(part => {
    part = part.trim();
    const [ruleName, paramsString] = part.split(':', 2);
    const params: Record<string, string> = {};
    let customMessage: string | undefined;
    let customMessageKey: string | undefined;

    if (paramsString) {
      // Split by comma, but allow for quoted values
      const paramPairs = paramsString.match(/([a-zA-Z0-9_]+\s*=\s*(?:"[^"]*"|'[^']*'|[^,]+))/g);
      if (paramPairs) {
        for (const pair of paramPairs) {
          const [key, ...rest] = pair.split('=');
          let value = rest.join('=').trim();
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          const cleanKey = key.trim();
          if (cleanKey === 'message') {
            customMessage = value;
          } else if (cleanKey === 'key') {
            customMessageKey = value;
          } else {
            params[cleanKey] = value;
          }
        }
      }
    }
    return { rule: ruleName, params, customMessage, customMessageKey } as ParsedRule;
  });
  return { transformers, rules } as ParsedValidation;
}
