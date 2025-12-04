"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMamoLinkSchema = exports.RefundMimoOrderSchema = exports.CancelMimoOrderSchema = exports.CaptureMimoOrderSchema = exports.CreateMimoOrderSchema = void 0;
// src/application/dto/MimoOrder.dto.ts
const zod_1 = require("zod");
exports.CreateMimoOrderSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3), // زي AED أو SAR
    screen_type: zod_1.z.enum(["checkout", "embedded", "payment_link"]).default("checkout"),
    description: zod_1.z.string(),
    capture_method: zod_1.z.enum(["AUTOMATIC", "MANUAL"]).default("AUTOMATIC"), // ✅ تمت الإضافة
    customer: zod_1.z.object({
        email: zod_1.z.string().email(),
        first_name: zod_1.z.string(),
        last_name: zod_1.z.string(),
        phone_number: zod_1.z.string(),
    }),
    callback_urls: zod_1.z.object({
        success: zod_1.z.string().url(),
        cancel: zod_1.z.string().url(),
        failure: zod_1.z.string().url(),
        notification: zod_1.z.string().url(),
    }),
    metadata: zod_1.z.record(zod_1.z.string()).optional(), // ✅ تمت الإضافة
});
exports.CaptureMimoOrderSchema = zod_1.z.object({
    amount: zod_1.z.number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number"
    }).positive("Amount must be greater than zero"),
});
exports.CancelMimoOrderSchema = zod_1.z.object({
    paymentId: zod_1.z.string(),
    reason: zod_1.z.string().optional(),
});
exports.RefundMimoOrderSchema = zod_1.z.object({
    paymentId: zod_1.z.string(),
    amount: zod_1.z.number(),
    reason: zod_1.z.string().optional(),
});
exports.CreateMamoLinkSchema = zod_1.z.object({
    title: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
    capture_method: zod_1.z.string().default("MANUAL"),
    currency: zod_1.z.string().default("AED"),
    return_url: zod_1.z.string().url().optional(),
    hold_and_charge_later: zod_1.z.boolean().optional(),
});
