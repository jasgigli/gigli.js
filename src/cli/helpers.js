"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printHelp = printHelp;
exports.parseArgs = parseArgs;
function printHelp() {
    console.log(`gigli.js CLI\n\nUsage:\n  npx gigli.js codegen --schema <file> --target <openapi|jsonschema>\n  npx gigli.js analyze --schema <file>\n`);
}
function parseArgs(args) {
    const out = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith("--")) {
            out[args[i].replace(/^--/, "")] = args[i + 1];
            i++;
        }
    }
    return out;
}
