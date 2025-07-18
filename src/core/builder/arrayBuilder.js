"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayBuilder = void 0;
class ArrayBuilder {
    constructor(element) {
        this.node = {
            type: 'array',
            element: typeof element.toAST === 'function' ? element.toAST() : element,
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
exports.ArrayBuilder = ArrayBuilder;
