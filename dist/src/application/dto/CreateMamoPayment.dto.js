"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMamoPaymentSchema = void 0;
const zod_1 = require("zod");
exports.CreateMamoPaymentSchema = zod_1.z.object({
    amount: zod_1.z
        .number()
        .positive()
        .describe("Total amount, in the smallest currency unit (e.g. 100.00)"),
    currency: zod_1.z.string().length(3).describe("ISO 4217 currency code"),
    title: zod_1.z
        .string()
        .optional()
        .describe("A short title displayed on the payment page"),
    description: zod_1.z
        .string()
        .optional()
        .describe("Detailed description for the payment"),
    callbackUrl: zod_1.z
        .string()
        .url()
        .optional()
        .describe("Webhook endpoint for payment status changes"),
    redirectUrl: zod_1.z
        .string()
        .url()
        .describe("Where we send the user after payment completion"),
    metadata: zod_1.z
        .object({
        reservationId: zod_1.z.string().optional(),
        customerId: zod_1.z.string().optional(),
        clientId: zod_1.z.string().optional(),
    })
        .optional()
        .describe("Any extra info you want back in the webhook"),
});
