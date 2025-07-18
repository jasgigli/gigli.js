"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectBuilder = void 0;
class ObjectBuilder {
    constructor(fields) {
        this.node = {
            type: "object",
            fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [
                k,
                typeof v.toAST === "function" ? v.toAST() : v,
            ])),
        };
    }
    optional() {
        this.node.optional = true;
        return this;
    }
    toAST() {
        return this.node;
    }
}
exports.ObjectBuilder = ObjectBuilder;
