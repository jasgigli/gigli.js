import type { ParsedValidation, ParsedRule } from '../../../types/parser/types';

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
      const paramRegex = /(\
