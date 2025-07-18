"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimitiveBuilder = exports.ObjectBuilder = exports.ArrayBuilder = exports.v = exports.VBuilder = void 0;
const ruleParser_1 = require("../parser/ruleParser");
const arrayBuilder_1 = require("./arrayBuilder");
Object.defineProperty(exports, "ArrayBuilder", { enumerable: true, get: function () { return arrayBuilder_1.ArrayBuilder; } });
const objectBuilder_1 = require("./objectBuilder");
Object.defineProperty(exports, "ObjectBuilder", { enumerable: true, get: function () { return objectBuilder_1.ObjectBuilder; } });
const primitiveBuilder_1 = require("./primitiveBuilder");
Object.defineProperty(exports, "PrimitiveBuilder", { enumerable: true, get: function () { return primitiveBuilder_1.PrimitiveBuilder; } });
class VBuilder {
    string() {
        return new primitiveBuilder_1.PrimitiveBuilder("string");
    }
    number() {
        return new primitiveBuilder_1.PrimitiveBuilder("number");
    }
    boolean() {
        return new primitiveBuilder_1.PrimitiveBuilder("boolean");
    }
    date() {
        return new primitiveBuilder_1.PrimitiveBuilder("date");
    }
    any() {
        return new primitiveBuilder_1.PrimitiveBuilder("any");
    }
    object(fields) {
        return new objectBuilder_1.ObjectBuilder(fields);
    }
    array(element) {
        return new arrayBuilder_1.ArrayBuilder(element);
    }
    from(ruleString) {
        const parsed = (0, ruleParser_1.parse)(ruleString);
        const node = {
            type: "primitive",
            primitive: "any",
            transformers: parsed.transformers.map((name) => ({
                type: "transformer",
                name,
            })),
            rules: parsed.rules.map((r) => ({
                type: "rule",
                name: r.rule,
                params: r.params,
                message: r.customMessage,
                key: r.customMessageKey,
            })),
        };
        return {
            toAST: () => node,
        };
    }
}
exports.VBuilder = VBuilder;
exports.v = new VBuilder();
