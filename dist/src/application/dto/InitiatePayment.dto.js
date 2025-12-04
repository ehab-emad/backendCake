"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitiatePaymentSchema = void 0;
const zod_1 = require("zod");
exports.InitiatePaymentSchema = zod_1.z.object({
    reservationId: zod_1.z.string().uuid(),
    gateway: zod_1.z.enum(["stripe", "tamara", "mimo"]),
    method: zod_1.z.string().optional(),
    successUrl: zod_1.z.string().url().optional(),
    cancelUrl: zod_1.z.string().url().optional(),
});
