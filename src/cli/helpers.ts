export function printHelp() {
  console.log(`Validex CLI\n\nUsage:\n  npx validex codegen --schema <file> --target <openapi|jsonschema>\n  npx validex analyze --schema <file>\n`);
}

export function parseArgs(args: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      out[args[i].replace(/^--/, '')] = args[i+1];
      i++;
    }
  }
  return out;
}
