#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const helpers_1 = require("./helpers");
const [, , command, ...args] = process.argv;
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!command || command === '--help' || command === '-h') {
        (0, helpers_1.printHelp)();
        process.exit(0);
    }
    if (command === '--version' || command === '-v') {
        // Read version from package.json, resolving from the CLI file location
        try {
            let pkgPath = '';
            // Try to resolve from process.cwd() (for npx or global usage)
            if ((0, fs_1.existsSync)((0, path_1.join)(process.cwd(), 'package.json'))) {
                pkgPath = (0, path_1.join)(process.cwd(), 'package.json');
            }
            else {
                // Try to resolve from dist/cli location
                const cliPath = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
                pkgPath = (0, path_1.join)(cliPath, '../../package.json');
                if (!(0, fs_1.existsSync)(pkgPath)) {
                    // Fallback: try up from dist/cli/index.js
                    pkgPath = (0, path_1.join)(cliPath, '../../../package.json');
                }
            }
            const pkg = JSON.parse((0, fs_1.readFileSync)(pkgPath, 'utf8'));
            console.log(pkg.version);
        }
        catch (e) {
            console.error('Could not read version:', e);
        }
        process.exit(0);
    }
    if (command === 'codegen') {
        const { runCodegen } = yield Promise.resolve().then(() => __importStar(require('./codegen')));
        yield runCodegen(args);
        return;
    }
    if (command === 'analyze') {
        const { runAnalyze } = yield Promise.resolve().then(() => __importStar(require('./analyze')));
        yield runAnalyze(args);
        return;
    }
    console.error(`[gigli.js] Unknown command: ${command}`);
    (0, helpers_1.printHelp)();
    process.exit(1);
}))();
