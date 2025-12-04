"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptureStripeOrderSchema = exports.RefundStripeOrderSchema = exports.CreateStripeOrderSchema = void 0;
const zod_1 = require("zod");
exports.CreateStripeOrderSchema = zod_1.z.object({
    amount: zod_1.z.number().min(1),
    currency: zod_1.z.string().min(1),
    customerEmail: zod_1.z.string().email(),
    successUrl: zod_1.z.string().url(),
    cancelUrl: zod_1.z.string().url(),
    productName: zod_1.z.string().optional(),
    clientId: zod_1.z.string().min(1),
});
exports.RefundStripeOrderSchema = zod_1.z.object({
    paymentIntent: zod_1.z.string().min(1),
    amount: zod_1.z.number().optional(),
    comment: zod_1.z.string().optional(),
});
exports.CaptureStripeOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string().min(1), // ده غالبًا الـ paymentIntent ID
    amount: zod_1.z.number().min(1),
    currency: zod_1.z.string().min(1),
});
