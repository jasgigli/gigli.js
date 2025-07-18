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
exports.runAnalyze = runAnalyze;
const helpers_1 = require("./helpers");
function runAnalyze(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = (0, helpers_1.parseArgs)(args);
        if (!opts['schema']) {
            console.error('[gigli.js] --schema is required for analyze.');
            (0, helpers_1.printHelp)();
            process.exit(1);
        }
        const schemaPath = opts['schema'];
        // Efficient: Register ts-node if loading a .ts file
        if (schemaPath.endsWith('.ts')) {
            require('ts-node/register');
        }
        try {
            const schemaModule = yield Promise.resolve(`${require('path').resolve(schemaPath)}`).then(s => __importStar(require(s)));
            const schema = schemaModule.default || schemaModule.schema || schemaModule.UserSchema;
            if (!schema) {
                console.error('[gigli.js] Could not find a schema export in the file.');
                process.exit(1);
            }
            const { analyzeSchema } = yield Promise.resolve().then(() => __importStar(require('../core/analyze/analyzeSchema')));
            const ast = typeof schema.toAST === 'function' ? schema.toAST() : schema;
            const issues = analyzeSchema(ast);
            if (issues.length === 0) {
                console.log('No issues found.');
            }
            else {
                console.log('Schema analysis report:');
                for (const issue of issues) {
                    console.log(' -', issue);
                }
            }
        }
        catch (e) {
            console.error('[gigli.js] Failed to load schema:', e);
            process.exit(1);
        }
    });
}
