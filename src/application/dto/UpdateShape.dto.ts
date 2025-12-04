import { z } from "zod";

export const UpdateShapeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters").optional(),
  numberOfPeople: z.preprocess(val => parseInt(val as string, 10), z.number().int().positive("Number of people must be a positive integer")).optional(), 
  weight: z.preprocess(val => parseFloat(val as string), z.number().positive("Weight must be a positive number")).optional(),
  width: z.preprocess(val => parseFloat(val as string), z.number().positive("Width must be a positive number")).optional(),
  height: z.preprocess(val => parseFloat(val as string), z.number().positive("Height must be a positive number")).optional(),
  price: z.preprocess(val => parseFloat(val as string), z.number().positive("Price must be a positive number")).optional(),
  frontImage: z.string().optional(), 
  sideImage: z.string().optional(),  
  leftImage: z.string().optional(),   
  removeImageIds: z.array(z.string().uuid("Image ID must be a valid UUID")).optional(),
});

export type UpdateShapeDTO = z.infer<typeof UpdateShapeSchema>;
