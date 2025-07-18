#!/usr/bin/env node

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { printHelp } from './helpers';

const [,, command, ...args] = process.argv;

(async () => {
  if (!command || command === '--help' || command === '-h') {
    printHelp();
    process.exit(0);
  }

  if (command === '--version' || command === '-v') {
    // Read version from package.json, resolving from the CLI file location
    try {
      // Find the root directory of the package
      const cliPath = require.resolve('./index.js');
      const rootDir = dirname(dirname(cliPath));
      const pkgPath = join(rootDir, 'package.json');
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      console.log(pkg.version);
    } catch (e) {
      console.error('Could not read version:', e);
    }
    process.exit(0);
  }

  if (command === 'codegen') {
    const { runCodegen } = await import('./codegen');
    await runCodegen(args);
    return;
  }
  if (command === 'analyze') {
    const { runAnalyze } = await import('./analyze');
    await runAnalyze(args);
    return;
  }
  console.error(`[gigli.js] Unknown command: ${command}`);
  printHelp();
  process.exit(1);
})();
