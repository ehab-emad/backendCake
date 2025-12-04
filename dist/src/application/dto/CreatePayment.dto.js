"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentSchema = void 0;
const zod_1 = require("zod");
exports.CreatePaymentSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid(),
    customerId: zod_1.z.string().uuid(),
    reservationId: zod_1.z.string().uuid().nullable().optional(),
    category: zod_1.z.string(),
    transactionStatus: zod_1.z.enum(["paid", "under_review", "cancelled"]),
    amount: zod_1.z.number().positive(),
});
