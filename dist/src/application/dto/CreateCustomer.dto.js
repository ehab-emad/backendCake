"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomerSchema = void 0;
const zod_1 = require("zod");
exports.CreateCustomerSchema = zod_1.z.object({
    // System Fields
    authUserId: zod_1.z.string().uuid(),
    customerType: zod_1.z.enum(["VIP", "Regular"]).optional(),
    registrationDate: zod_1.z.date().or(zod_1.z.string()).optional(),
    // Personal Information
    name: zod_1.z.string().optional(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phoneNumber: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.string().or(zod_1.z.date()).optional(),
    // Identification
    nationality: zod_1.z.string().optional(),
    passportNumber: zod_1.z.string().optional(),
    passportExpiry: zod_1.z.string().or(zod_1.z.date()).optional(),
    nationalId: zod_1.z.string().optional(),
    nationalIdExpiry: zod_1.z.string().or(zod_1.z.date()).optional(),
    // Address
    addressLine1: zod_1.z.string().optional(),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    // Location
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
    // Authentication & Preferences
    profilePicture: zod_1.z.string().optional(), // Accepts any string path for file uploads
    locale: zod_1.z.string().optional(),
    // Additional Fields
    customername: zod_1.z.string().optional(),
    expirationDate: zod_1.z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), {
        message: "Invalid date",
    })
        .optional(),
});
