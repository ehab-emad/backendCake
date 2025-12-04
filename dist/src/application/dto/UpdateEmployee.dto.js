"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeSchema = void 0;
const zod_1 = require("zod");
exports.UpdateEmployeeSchema = zod_1.z.object({
    // Required fields
    role: zod_1.z.string().min(1, { message: "الدور الوظيفي مطلوب" }),
    address: zod_1.z.string().min(1, { message: "العنوان مطلوب" }),
    phoneNumber: zod_1.z.string().min(1, { message: "رقم الهاتف مطلوب" }),
    email: zod_1.z.string().email({ message: "البريد الإلكتروني غير صالح" }).min(1, { message: "البريد الإلكتروني مطلوب" }),
    // Optional fields
    website: zod_1.z.string().url({ message: "الرابط غير صالح" }).optional(),
    additionalPhoneNumber: zod_1.z.string().optional(),
    // Media fields
    profileImage: zod_1.z.string().optional(),
    newImages: zod_1.z
        .preprocess((v) => (typeof v === "string" ? JSON.parse(v) : v), zod_1.z.array(zod_1.z.string()).optional().default([]))
        .optional()
        .default([]),
    // Status
    active: zod_1.z.boolean().default(true).optional(),
});
