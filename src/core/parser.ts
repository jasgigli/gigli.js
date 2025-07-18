export interface ParsedRule {
  rule: string;
  params: Record<string, string>;
  customMessage?: string;
  customMessageKey?: string;
}

export interface ParsedValidation {
  transformers: string[];
  rules: ParsedRule[];
}

/**
 * Parses a Validex V3 rule string.
 * Supports transformers, chaining, custom messages, and i18n keys.
 */
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
      // Use regex to handle quoted messages and keys
      const paramRegex = /(\w+)=('([^']*)'|"([^"]*)"|([^,]*))/g;
      let match;
      while ((match = paramRegex.exec(paramsString)) !== null) {
        const key = match[1];
        const value = match[3] ?? match[4] ?? match[5];
        if (key === 'message') {
          customMessage = value;
        } else if (key === 'key') {
          customMessageKey = value;
        } else {
          params[key] = value;
        }
      }
    }
    return { rule: ruleName.trim(), params, customMessage, customMessageKey };
  });

  return { transformers, rules };
}
