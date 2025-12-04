"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClientSchema = void 0;
const zod_1 = require("zod");
exports.UpdateClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().optional(),
    address: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    profileImage: zod_1.z.string().optional(),
    attachments: zod_1.z.array(zod_1.z.string()).optional(),
    licenseNumber: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    websiteUrl: zod_1.z.string().url().optional(),
    additionalPhoneNumber: zod_1.z.string().optional(),
    subscriptionType: zod_1.z.string().optional(),
    rating: zod_1.z.coerce.number().min(0).max(5).optional(),
    approved: zod_1.z.boolean().optional(),
    active: zod_1.z.boolean().optional(),
});
