"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductSchema = void 0;
const zod_1 = require("zod");
exports.CreateProductSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid("Client ID must be a valid UUID"),
    name: zod_1.z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters"),
    description: zod_1.z.string().min(1, "Description is required"),
    fullDescription: zod_1.z.string().min(1, "Full description is required"),
    price: zod_1.z.preprocess(val => parseFloat(val), zod_1.z.number().positive("Price must be a positive number")),
    stockQuantity: zod_1.z.preprocess(val => parseInt(val, 10), zod_1.z.number().int().min(0, "Stock quantity cannot be negative").default(0)),
    imageUrl: zod_1.z.string().url("Invalid image URL").optional(),
    material: zod_1.z.string().optional(),
    beads: zod_1.z.string().optional(),
    length: zod_1.z.string().optional(),
    weight: zod_1.z.string().optional(),
    status: zod_1.z.string().optional().default("active"),
    images: zod_1.z.preprocess(val => (typeof val === 'string' ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string().url("Invalid image URL")).optional().default([])),
    ratings: zod_1.z.preprocess(val => (typeof val === 'string' ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        comment: zod_1.z.string().optional(),
        rating: zod_1.z.preprocess(val => parseFloat(val), zod_1.z.number().min(0).max(5)),
        images: zod_1.z.preprocess(val => (typeof val === 'string' ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string().url("Invalid image URL")).optional().default([])),
    })).optional().default([])),
});
