#!/usr/bin/env node

// Validex CLI Tool (v4 scaffold)

const [,, command, ...args] = process.argv;

function printHelp() {
  console.log(`Validex CLI

Usage:
  npx validex codegen --schema <file> --target <openapi|jsonschema>
  npx validex analyze --schema <file>
`);
}

function parseArgs(args: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      out[args[i].replace(/^--/, '')] = args[i+1];
      i++;
    }
  }
  return out;
}

if (!command || command === '--help' || command === '-h') {
  printHelp();
  process.exit(0);
}

if (command === 'codegen') {
  const opts = parseArgs(args);
  if (!opts['schema'] || !opts['target']) {
    console.error('[validex] --schema and --target are required for codegen.');
    printHelp();
    process.exit(1);
  }
  // Only support .ts for now
  const schemaPath = opts['schema'];
  const target = opts['target'];
  (async () => {
    try {
      // Dynamic import (assume ESM or transpiled)
      const schemaModule: any = await import(require('path').resolve(schemaPath));
      const schema = schemaModule.default || schemaModule.schema || schemaModule.UserSchema;
      if (!schema) {
        console.error('[validex] Could not find a schema export in the file.');
        process.exit(1);
      }
      // Import codegen utilities
      const { generateJsonSchema, generateOpenApiSchema } = require('./core/codegen');
      const ast = typeof schema.toAST === 'function' ? schema.toAST() : schema;
      if (target === 'openapi') {
        const openapi = generateOpenApiSchema(ast);
        console.log(JSON.stringify(openapi, null, 2));
      } else if (target === 'jsonschema') {
        const jsonschema = generateJsonSchema(ast);
        console.log(JSON.stringify(jsonschema, null, 2));
      } else {
        console.error('[validex] Unknown target:', target);
        process.exit(1);
      }
    } catch (e) {
      console.error('[validex] Failed to load schema:', e);
      process.exit(1);
    }
    // No return needed here
  })();
}
else if (command === 'analyze') {
  const opts = parseArgs(args);
  if (!opts['schema']) {
    console.error('[validex] --schema is required for analyze.');
    printHelp();
    process.exit(1);
  }
  const schemaPath = opts['schema'];
  (async () => {
    try {
      const schemaModule: any = await import(require('path').resolve(schemaPath));
      const schema = schemaModule.default || schemaModule.schema || schemaModule.UserSchema;
      if (!schema) {
        console.error('[validex] Could not find a schema export in the file.');
        process.exit(1);
      }
      const { analyzeSchema } = require('./core/analyze');
      const ast = typeof schema.toAST === 'function' ? schema.toAST() : schema;
      const issues = analyzeSchema(ast);
      if (issues.length === 0) {
        console.log('No issues found.');
      } else {
        console.log('Schema analysis report:');
        for (const issue of issues) {
          console.log(' -', issue);
        }
      }
    } catch (e) {
      console.error('[validex] Failed to load schema:', e);
      process.exit(1);
    }
  })();
}
else {
  console.error(`[validex] Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}
