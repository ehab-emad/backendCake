"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStripeSessionSchema = void 0;
const zod_1 = require("zod");
exports.CreateStripeSessionSchema = zod_1.z.object({
    amount: zod_1.z.number().gt(0),
    currency: zod_1.z.string().min(3).max(3),
    successUrl: zod_1.z.string().url(),
    cancelUrl: zod_1.z.string().url(),
    agencyAccountId: zod_1.z.string().optional(),
    commissionAmount: zod_1.z.number().optional(),
});
