"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductSchema = void 0;
const zod_1 = require("zod");
exports.UpdateProductSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid("Client ID must be a valid UUID").optional(),
    name: zod_1.z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters").optional(),
    description: zod_1.z.string().min(1, "Description is required").optional(),
    fullDescription: zod_1.z.string().min(1, "Full description is required").optional(),
    price: zod_1.z.number().positive("Price must be a positive number").optional(),
    stockQuantity: zod_1.z.number().int().min(0, "Stock quantity cannot be negative").optional(),
    imageUrl: zod_1.z.string().url("Invalid image URL").optional(),
    material: zod_1.z.string().optional(),
    beads: zod_1.z.string().optional(),
    length: zod_1.z.string().optional(),
    weight: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    newImages: zod_1.z.array(zod_1.z.string().url("Invalid image URL")).optional().default([]),
    removeImageIds: zod_1.z.array(zod_1.z.string().uuid("Invalid image ID")).optional().default([]),
});
