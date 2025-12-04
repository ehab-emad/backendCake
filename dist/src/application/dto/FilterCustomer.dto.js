"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterCustomerSchema = void 0;
const zod_1 = require("zod");
exports.FilterCustomerSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).default(20),
});
