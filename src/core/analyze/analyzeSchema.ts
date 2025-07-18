
export function analyzeSchema(ast: any): string[] {
  const issues: string[] = [];

  function walk(node: any, path: string[] = []) {
    if (node.type === 'primitive') {
      // Example: check for min > max
      if (node.rules) {
        let min: number | undefined;
        let max: number | undefined;
        for (const rule of node.rules) {
          if (rule.name === 'min' && rule.params && rule.params.value !== undefined) min = Number(rule.params.value);
          if (rule.name === 'max' && rule.params && rule.params.value !== undefined) max = Number(rule.params.value);
        }
        if (min !== undefined && max !== undefined && min > max) {
          issues.push(`Impossible rule at ${path.join('.') || 'root'}: min (${min}) > max (${max})`);
        }
      }
    }
    if (node.type === 'object') {
      for (const key in node.fields) {
        walk(node.fields[key], [...path, key]);
      }
    }
    if (node.type === 'array') {
      walk(node.element, [...path, '[*]']);
    }
    if (node.type === 'pipeline') {
      for (const step of node.steps) {
        if (step.type === 'dispatch') {
          // Check for unreachable dispatch cases (stub)
          if (!step.cases || Object.keys(step.cases).length === 0) {
            issues.push(`Unreachable dispatch at ${path.join('.') || 'root'}: no cases defined`);
          }
        }
        if (step.type === 'validate' && step.schema) {
          walk(step.schema, path);
        }
      }
    }
    if (node.type === 'class') {
      for (const key in node.fields) {
        walk(node.fields[key], [...path, key]);
      }
      if (node.refinements) {
        for (const refine of node.refinements) {
          if (typeof refine.fn !== 'function') {
            issues.push(`Invalid refinement at ${path.join('.') || 'root'}: not a function`);
          }
          // Optionally, you could try to statically analyze the refinement, but that's non-trivial
        }
      }
    }
    // TODO: handle class nodes, refinements, etc.
  }

  walk(ast);
  return issues;
}
