import { getAsyncRule, getSyncRule } from '../../core/registry/ruleRegistry';
import { getTransformer } from '../../core/registry/transformerRegistry';
import type { ValidationTraceResult } from '../../types/engine/types';

export async function validateAST(node: any, value: any, context: any = {}): Promise<ValidationTraceResult> {
  const trace: any[] = [];
  let valid = true;
  let errors: string[] = [];
  let currentValue = value;

  if (node.type === 'primitive') {
    // Apply transformers
    if (node.transformers) {
      for (const t of node.transformers) {
        const before = currentValue;
        const fn = getTransformer(t.name);
        if (fn) {
          currentValue = fn(currentValue, t.params);
          trace.push({ node: t, valueBefore: before, valueAfter: currentValue });
        } else {
          trace.push({ node: t, valueBefore: before, error: `Unknown transformer: ${t.name}` });
        }
      }
    }
    // Apply rules
    if (node.rules) {
      for (const r of node.rules) {
        const before = currentValue;
        const syncFn = getSyncRule(r.name);
        const asyncFn = getAsyncRule(r.name);
        let result = false;
        if (syncFn) {
          result = syncFn(currentValue, r.params, context);
          trace.push({ node: r, valueBefore: before, ruleApplied: r.name, result });
          if (!result) {
            valid = false;
            errors.push(r.message || `Failed rule: ${r.name}`);
          }
        } else if (asyncFn) {
          result = await asyncFn(currentValue, r.params, context);
          trace.push({ node: r, valueBefore: before, ruleApplied: r.name, result });
          if (!result) {
            valid = false;
            errors.push(r.message || `Failed rule: ${r.name}`);
          }
        } else {
          trace.push({ node: r, valueBefore: before, error: `Unknown rule: ${r.name}` });
          valid = false;
          errors.push(`Unknown rule: ${r.name}`);
        }
      }
    }
    return { valid, value: currentValue, errors, trace };
  }

  if (node.type === 'object') {
    const out: Record<string, any> = {};
    for (const key in node.fields) {
      const fieldNode = node.fields[key];
      const fieldValue = value ? value[key] : undefined;
      const res = await validateAST(fieldNode, fieldValue, context);
      out[key] = res.value;
      trace.push(...res.trace);
      if (!res.valid) {
        valid = false;
        errors.push(...res.errors.map((e: string) => `${key}: ${e}`));
      }
    }
    return { valid, value: out, errors, trace };
  }

  if (node.type === 'array') {
    if (!Array.isArray(value)) {
      valid = false;
      errors.push('Value is not an array');
      trace.push({ node, valueBefore: value, error: 'Value is not an array' });
      return { valid, value, errors, trace };
    }
    const out: any[] = [];
    for (let i = 0; i < value.length; i++) {
      const res = await validateAST(node.element, value[i], context);
      out[i] = res.value;
      trace.push(...res.trace);
      if (!res.valid) {
        valid = false;
        errors.push(...res.errors.map((e: string) => `[${i}]: ${e}`));
      }
    }
    return { valid, value: out, errors, trace };
  }

  if (node.type === 'pipeline') {
    let pipelineValue = value;
    let pipelineValid = true;
    let pipelineErrors: string[] = [];
    let pipelineTrace: any[] = [];
    let dispatchMatched = false;
    let effectStep: any = null;
    let effectTrace: any = null;
    for (const step of node.steps) {
      if (step.type === 'transform') {
        const before = pipelineValue;
        let after = pipelineValue;
        if (typeof step.fn === 'function') {
          after = step.fn(pipelineValue);
        } else if (step.fn && step.fn.type === 'transformer') {
          const fn = getTransformer(step.fn.name);
          if (fn) {
            after = fn(pipelineValue, step.fn.params);
          } else {
            pipelineErrors.push(`Unknown transformer: ${step.fn.name}`);
            pipelineTrace.push({ node: step.fn, valueBefore: before, error: `Unknown transformer: ${step.fn.name}` });
            pipelineValid = false;
            continue;
          }
        }
        pipelineTrace.push({ node: step, valueBefore: before, valueAfter: after });
        pipelineValue = after;
      } else if (step.type === 'validate') {
        const res = await validateAST(step.schema, pipelineValue, context);
        pipelineTrace.push(...res.trace);
        pipelineValue = res.value;
        if (!res.valid) {
          pipelineValid = false;
          pipelineErrors.push(...res.errors);
        }
      } else if (step.type === 'refine') {
        const before = pipelineValue;
        const result = step.fn(pipelineValue);
        pipelineTrace.push({ node: step, valueBefore: before, ruleApplied: 'refine', result });
        if (!result) {
          pipelineValid = false;
          pipelineErrors.push(step.message || 'Refinement failed');
        }
      } else if (step.type === 'dispatch') {
        // Implement dispatch logic
        const fieldValue = pipelineValue[step.field];
        const schema = step.cases[fieldValue];
        if (schema) {
          const res = await validateAST(schema, pipelineValue, context);
          pipelineTrace.push(...res.trace);
          pipelineValue = res.value;
          if (!res.valid) {
            pipelineValid = false;
            pipelineErrors.push(...res.errors);
          }
          dispatchMatched = true;
        } else {
          pipelineTrace.push({ node: step, valueBefore: pipelineValue, error: `No dispatch case for value: ${fieldValue}` });
          pipelineValid = false;
          pipelineErrors.push(`No dispatch case for value: ${fieldValue}`);
        }
      } else if (step.type === 'effect') {
        // Store effect step for after pipeline execution
        effectStep = step;
      }
    }
    // After all steps, run effect if present
    if (effectStep) {
      effectTrace = { node: effectStep, valueBefore: pipelineValue };
      if (pipelineValid && effectStep.onSuccess) {
        try {
          effectStep.onSuccess({ input: value, output: pipelineValue, errors: pipelineErrors, trace: pipelineTrace });
          effectTrace.valueAfter = pipelineValue;
        } catch (e) {
          effectTrace.error = `Effect onSuccess error: ${e}`;
        }
      } else if (!pipelineValid && effectStep.onFailure) {
        try {
          effectStep.onFailure({ input: value, output: pipelineValue, errors: pipelineErrors, trace: pipelineTrace });
          effectTrace.valueAfter = pipelineValue;
        } catch (e) {
          effectTrace.error = `Effect onFailure error: ${e}`;
        }
      }
      pipelineTrace.push(effectTrace);
    }
    return { valid: pipelineValid, value: pipelineValue, errors: pipelineErrors, trace: pipelineTrace };
  }

  if (node.type === 'class') {
    const out: Record<string, any> = {};
    let classValid = true;
    let classErrors: string[] = [];
    let classTrace: any[] = [];
    for (const key in node.fields) {
      const fieldNode = node.fields[key];
      const fieldValue = value ? value[key] : undefined;
      const res = await validateAST(fieldNode, fieldValue, context);
      out[key] = res.value;
      classTrace.push(...res.trace);
      if (!res.valid) {
        classValid = false;
        classErrors.push(...res.errors.map((e: string) => `${key}: ${e}`));
      }
    }
    // Run refinements
    if (node.refinements) {
      for (const refine of node.refinements) {
        const result = refine.fn(out);
        classTrace.push({ node: refine, valueBefore: out, ruleApplied: 'refine', result });
        if (!result) {
          classValid = false;
          classErrors.push(refine.message || 'Class refinement failed');
        }
      }
    }
    return { valid: classValid, value: out, errors: classErrors, trace: classTrace };
  }
  trace.push({ node, valueBefore: value, error: `Unsupported node type: ${node.type}` });
  return { valid: false, value, errors: [`Unsupported node type: ${node.type}`], trace };
}
