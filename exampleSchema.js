"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("./src");
const userSchema = (0, src_1.object)({
    name: (0, src_1.string)().min(2),
    age: (0, src_1.number)().min(18),
    email: (0, src_1.string)().email(),
});
exports.default = userSchema;
