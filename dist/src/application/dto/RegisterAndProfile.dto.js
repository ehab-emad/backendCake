"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterAndProfileSchema = void 0;
const zod_1 = require("zod");
const CreateCustomer_dto_1 = require("../../application/dto/CreateCustomer.dto");
exports.RegisterAndProfileSchema = CreateCustomer_dto_1.CreateCustomerSchema.omit({
    authUserId: true,
}).extend({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
