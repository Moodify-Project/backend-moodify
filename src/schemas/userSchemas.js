"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = exports.userRegisterSchema = void 0;
const zod_1 = require("zod");
exports.userRegisterSchema = zod_1.z.object({
    username: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(30).regex(/[A-Z]/).regex(/[^a-zA-Z0-9]/),
    confirmPassword: zod_1.z.string().min(8).max(30).regex(/[A-Z]/).regex(/[^a-zA-Z0-9]/),
});
exports.userLoginSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string().min(8).max(30).regex(/[A-Z]/, "Require at least a capital letter on your password").regex(/[^a-zA-Z0-9]/, "Require atleast one symbol on your password"),
    // password: z.string().min(8).max(30),
});
