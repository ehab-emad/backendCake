"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerSchema = void 0;
const zod_1 = require("zod");
exports.UpdateCustomerSchema = zod_1.z.object({
    // File upload will be handled separately by multer
    authUserId: zod_1.z.string().uuid().optional(),
    customerType: zod_1.z.enum(["VIP", "Regular"]).optional(),
    nationality: zod_1.z.string().optional(),
    customername: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    passportNumber: zod_1.z.string().optional(),
    nationalId: zod_1.z.string().optional(),
    nationalIdExpiry: zod_1.z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), {
        message: "Invalid national ID expiry date",
    })
        .optional(),
    addressLine1: zod_1.z.string().optional(),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    // Profile picture will be handled by multer middleware
    profilePicture: zod_1.z.string().optional(),
    locale: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional(),
    // Name fields for better personalization
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    latitude: zod_1.z.coerce
        .number()
        .min(-90, { message: "latitude must be >= -90" })
        .max(90, { message: "latitude must be <= 90" })
        .optional(),
    longitude: zod_1.z.coerce
        .number()
        .min(-180, { message: "longitude must be >= -180" })
        .max(180, { message: "longitude must be <= 180" })
        .optional(),
    // Date fields with validation
    dateOfBirth: zod_1.z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), {
        message: "Invalid date of birth",
    })
        .optional(),
    passportExpiry: zod_1.z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), {
        message: "Invalid passport expiry date",
    })
        .optional(),
    registrationDate: zod_1.z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), {
        message: "Invalid registration date",
    })
        .optional(),
    expirationDate: zod_1.z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), {
        message: "Invalid expiration date",
    })
        .optional(),
    // Alias for backward compatibility
    name: zod_1.z.string().optional(),
});
