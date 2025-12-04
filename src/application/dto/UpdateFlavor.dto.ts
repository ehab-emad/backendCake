import { z } from "zod";

export const UpdateFlavorSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters").optional(),
  shapeId: z.string().uuid("Shape ID must be a valid UUID").optional(),
  price: z.preprocess(val => parseFloat(val as string), z.number().positive("Price must be a positive number")).optional(),
  frontImage: z.string().optional(), 
  sideImage: z.string().optional(),  
  leftImage: z.string().optional(),   
  removeImageIds: z.array(z.string().uuid("Image ID must be a valid UUID")).optional(),
});

export type UpdateFlavorDTO = z.infer<typeof UpdateFlavorSchema>;
