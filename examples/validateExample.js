"use strict";
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
// Try importing from the local gigli.js package. Adjust the path if needed.
const __1 = require("../");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // Define a user schema
        const userSchema = (0, __1.object)({
            name: (0, __1.string)().min(2),
            email: (0, __1.string)().email(),
            age: (0, __1.number)().min(18),
        });
        // Valid data
        const validUser = {
            name: 'Alice',
            email: 'alice@example.com',
            age: 30,
        };
        // Invalid data
        const invalidUser = {
            name: 'A', // too short
            email: 'not-an-email', // invalid email
            age: 15, // too young
        };
        // Validate valid user
        const validResult = yield (0, __1.validate)(userSchema, validUser);
        console.log('Valid user result:', validResult);
        // Validate invalid user
        const invalidResult = yield (0, __1.validate)(userSchema, invalidUser);
        console.log('Invalid user result:', invalidResult);
    });
}
run().catch(console.error);
