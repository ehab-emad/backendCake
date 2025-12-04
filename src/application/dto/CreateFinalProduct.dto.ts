import { z } from "zod";

export const CreateFinalProductSchema = z.object({
  maskId: z.string().uuid("Mask ID must be a valid UUID"),
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters"),
  price: z.preprocess(val => parseFloat(val as string), z.number().positive("Price must be a positive number")),
  category: z.string().min(1, "Category is required").max(255, "Category cannot exceed 255 characters"),
});

export type CreateFinalProductDTO = z.infer<typeof CreateFinalProductSchema>;
