import { z } from "zod";

export const CreateShapeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters"),
  numberOfPeople: z.preprocess(val => parseInt(val as string, 10), z.number().int().positive("Number of people must be a positive integer")), 
  weight: z.preprocess(val => parseFloat(val as string), z.number().positive("Weight must be a positive number")),
  width: z.preprocess(val => parseFloat(val as string), z.number().positive("Width must be a positive number")),
  height: z.preprocess(val => parseFloat(val as string), z.number().positive("Height must be a positive number")),
  price: z.preprocess(val => parseFloat(val as string), z.number().positive("Price must be a positive number")),
  frontImage: z.string().optional(), 
  sideImage: z.string().optional(),  
  leftImage: z.string().optional(),   
});

export type CreateShapeDTO = z.infer<typeof CreateShapeSchema>;
