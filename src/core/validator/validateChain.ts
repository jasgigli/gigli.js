import type { ParsedRule } from "../../types/parser/types";
import type { ValidationState } from "../../types/validator/types";
import { getAsyncRule } from "./asyncValidator";
import { getSyncRule } from "./syncValidator";

export async function validateChain(
  state: ValidationState,
  rules: ParsedRule[],
  options: any = {},
): Promise<{ valid: boolean; message?: string }> {
  for (const parsedRule of rules) {
    const syncFn = getSyncRule(parsedRule.rule);
    const asyncFn = getAsyncRule(parsedRule.rule);
    let isValid = false;
    if (syncFn) {
      isValid = syncFn(state, parsedRule.params);
    } else if (asyncFn) {
      isValid = await asyncFn(state, parsedRule.params);
    } else {
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
}
