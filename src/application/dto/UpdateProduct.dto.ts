import { z } from "zod";

export const UpdateProductSchema = z.object({
  clientId: z.string().uuid("Client ID must be a valid UUID").optional(),
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters").optional(),
  description: z.string().min(1, "Description is required").optional(),
  fullDescription: z.string().min(1, "Full description is required").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  stockQuantity: z.number().int().min(0, "Stock quantity cannot be negative").optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  material: z.string().optional(),
  beads: z.string().optional(),
  length: z.string().optional(),
  weight: z.string().optional(),
  status: z.string().optional(),
  newImages: z.array(z.string().url("Invalid image URL")).optional().default([]),
  removeImageIds: z.array(z.string().uuid("Invalid image ID")).optional().default([]),
});

export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
