import { z } from "zod";

export const CreateProductSchema = z.object({
  clientId: z.string().uuid("Client ID must be a valid UUID"),
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters"),
  description: z.string().min(1, "Description is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  price: z.preprocess(val => parseFloat(val as string), z.number().positive("Price must be a positive number")),
  stockQuantity: z.preprocess(val => parseInt(val as string, 10), z.number().int().min(0, "Stock quantity cannot be negative").default(0)),
  imageUrl: z.string().url("Invalid image URL").optional(),
  material: z.string().optional(),
  beads: z.string().optional(),
  length: z.string().optional(),
  weight: z.string().optional(),
  status: z.string().optional().default("active"),
  images: z.preprocess(val => (typeof val === 'string' ? JSON.parse(val) : val), z.array(z.string().url("Invalid image URL")).optional().default([])),
  ratings: z.preprocess(
    val => (typeof val === 'string' ? JSON.parse(val) : val),
    z.array(z.object({
      name: z.string(),
      comment: z.string().optional(),
      rating: z.preprocess(val => parseFloat(val as string), z.number().min(0).max(5)),
      images: z.preprocess(val => (typeof val === 'string' ? JSON.parse(val) : val), z.array(z.string().url("Invalid image URL")).optional().default([])),
    })).optional().default([]),
  ),
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
