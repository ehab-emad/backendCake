"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentSchema = void 0;
const zod_1 = require("zod");
exports.UpdatePaymentSchema = zod_1.z
    .object({
    clientId: zod_1.z.string().uuid().optional(),
    customerId: zod_1.z.string().uuid().optional(),
    reservationId: zod_1.z.string().uuid().optional(),
    category: zod_1.z.string().min(1).optional(),
    transactionStatus: zod_1.z.enum(["paid", "under_review", "cancelled"]).optional(),
    amount: zod_1.z.number().positive().optional(),
})
    .refine((dto) => Object.keys(dto).length > 0, {
    message: "At least one field must be provided",
});
