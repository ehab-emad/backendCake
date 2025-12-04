"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptureTamaraOrderSchema = exports.CreateTamaraOrderSchema = exports.RefundTamaraOrderSchema = exports.CancelTamaraOrderSchema = exports.MerchantUrlSchema = exports.AddressSchema = exports.ConsumerSchema = exports.ItemSchema = exports.DiscountSchema = exports.MoneySchema = void 0;
const zod_1 = require("zod");
exports.MoneySchema = zod_1.z.object({
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
});
exports.DiscountSchema = zod_1.z
    .object({
    amount: exports.MoneySchema,
    name: zod_1.z.string(),
})
    .nullable()
    .optional();
exports.ItemSchema = zod_1.z.object({
    name: zod_1.z.string(),
    type: zod_1.z.string(),
    referenceId: zod_1.z.string(),
    sku: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive(),
    unitPrice: exports.MoneySchema,
    totalAmount: exports.MoneySchema,
    taxAmount: exports.MoneySchema,
    discountAmount: exports.MoneySchema.optional(),
    itemUrl: zod_1.z.string().url(),
    imageUrl: zod_1.z.string().url(),
});
exports.ConsumerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
});
exports.AddressSchema = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    line1: zod_1.z.string(),
    line2: zod_1.z.string().optional(),
    city: zod_1.z.string(),
    region: zod_1.z.string(),
    postalCode: zod_1.z.string(),
    countryCode: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
});
exports.MerchantUrlSchema = zod_1.z.object({
    cancel: zod_1.z.string().url(),
    failure: zod_1.z.string().url(),
    success: zod_1.z.string().url(),
    notification: zod_1.z.string().url(),
});
exports.CancelTamaraOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string(),
    cancelReason: zod_1.z.string().optional(), // Tamara مش شرط تحط سبب، لكن اختياري
    amount: zod_1.z.number(), // ⬅️ إضافة
    currency: zod_1.z.string()
});
exports.RefundTamaraOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string(),
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
    comment: zod_1.z.string(), // ✅ تم إضافتها
    reason: zod_1.z.string().optional(),
});
exports.CreateTamaraOrderSchema = zod_1.z.object({
    totalAmount: exports.MoneySchema,
    shippingAmount: exports.MoneySchema,
    taxAmount: exports.MoneySchema,
    orderReferenceId: zod_1.z.string(),
    orderNumber: zod_1.z.string(),
    discount: exports.DiscountSchema,
    items: zod_1.z.array(exports.ItemSchema).min(1),
    consumer: exports.ConsumerSchema,
    countryCode: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    merchantUrl: exports.MerchantUrlSchema,
    paymentType: zod_1.z.enum(["PAY_LATER", "FULL_PAYMENT"]),
    instalments: zod_1.z.number().int().positive().optional(),
    shippingAddress: exports.AddressSchema,
    billingAddress: exports.AddressSchema,
    platform: zod_1.z.enum(["WEB", "MOBILE_APP"]).optional(),
    isMobile: zod_1.z.boolean().optional(),
    locale: zod_1.z.string().optional(),
    riskAssessment: zod_1.z.any().optional(),
    additionalData: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
});
exports.CaptureTamaraOrderSchema = zod_1.z.object({
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
    shippingAmount: zod_1.z.number().optional(),
    taxAmount: zod_1.z.number().optional(),
    discountAmount: zod_1.z.number().optional(),
    description: zod_1.z.string().optional(),
});
