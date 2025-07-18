import type { ParsedRule, ParsedValidation } from "../../types/parser/types";

export function parse(ruleString: string): ParsedValidation {
  // Find the last '=>' to separate transformers from rules
  let lastArrowIdx = ruleString.lastIndexOf("=>");
  let transformersString = "";
  let rulesString = ruleString;
  if (lastArrowIdx !== -1) {
    transformersString = ruleString.slice(0, lastArrowIdx).trim();
    rulesString = ruleString.slice(lastArrowIdx + 2).trim();
  }
  const transformers = transformersString
    ? transformersString
        .split("=>")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const rules: ParsedRule[] = rulesString.split("|").map((part) => {
    part = part.trim();
    // Split only on the first ':'
    const colonIdx = part.indexOf(":");
    let ruleName = part;
    let paramsString = "";
    if (colonIdx !== -1) {
      ruleName = part.slice(0, colonIdx).trim();
      paramsString = part.slice(colonIdx + 1).trim();
    }
    const params: Record<string, string> = {};
    let customMessage: string | undefined;
    let customMessageKey: string | undefined;

    if (paramsString) {
      const paramPairs = paramsString
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      for (const pair of paramPairs) {
        const eqIdx = pair.indexOf("=");
        if (eqIdx === -1) continue;
        const key = pair.slice(0, eqIdx).trim();
        let value = pair.slice(eqIdx + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (key === "message") {
          customMessage = value;
        } else if (key === "key") {
          customMessageKey = value;
        } else {
          params[key] = value;
        }
      }
    }
    return {
      rule: ruleName,
      params,
      customMessage,
      customMessageKey,
    } as ParsedRule;
  });
  return { transformers, rules } as ParsedValidation;
}
