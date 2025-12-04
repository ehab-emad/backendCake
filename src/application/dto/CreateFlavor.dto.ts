import { z } from "zod";

export const CreateFlavorSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters"),
  shapeId: z.string().uuid("Shape ID must be a valid UUID"),
  price: z.preprocess(val => parseFloat(val as string), z.number().positive("Price must be a positive number")),
  frontImage: z.string().optional(), 
  sideImage: z.string().optional(),  
  leftImage: z.string().optional(),   
});

export type CreateFlavorDTO = z.infer<typeof CreateFlavorSchema>;
