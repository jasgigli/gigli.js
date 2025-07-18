"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJsonSchema = generateJsonSchema;
exports.isOptionalField = isOptionalField;
function isOptionalField(node) {
    return ((node.type === "primitive" ||
        node.type === "object" ||
        node.type === "array") &&
        !!node.optional);
}
function generateJsonSchema(node) {
    if (node.type === "primitive") {
        let type = node.primitive;
        if (type === "any")
            type = "string";
        return { type };
    }
    if (node.type === "object") {
        const properties = {};
        const required = [];
        for (const key in node.fields) {
            properties[key] = generateJsonSchema(node.fields[key]);
            if (!isOptionalField(node.fields[key]))
                required.push(key);
        }
        return {
            type: "object",
            properties,
            required: required.length ? required : undefined,
        };
    }
    if (node.type === "array") {
        return {
            type: "array",
            items: generateJsonSchema(node.element),
        };
    }
    if (node.type === "class") {
        // Treat class like object for JSON Schema
        const properties = {};
        const required = [];
        for (const key in node.fields) {
            properties[key] = generateJsonSchema(node.fields[key]);
            if (!isOptionalField(node.fields[key]))
                required.push(key);
        }
        return {
            type: "object",
            properties,
            required: required.length ? required : undefined,
        };
    }
    if (node.type === "pipeline") {
        // Output the schema for the first validate step, or a generic object
        const validateStep = node.steps.find((s) => s.type === "validate");
        if (validateStep && validateStep.schema) {
            return generateJsonSchema(validateStep.schema);
        }
        return { type: "object" };
    }
    return {};
}
