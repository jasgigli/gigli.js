#!/usr/bin/env node

import { printHelp } from './helpers';

const [,, command, ...args] = process.argv;

(async () => {
  if (!command || command === '--help' || command === '-h') {
    printHelp();
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
  console.error(`[validex] Unknown command: ${command}`);
  printHelp();
  process.exit(1);
})();
