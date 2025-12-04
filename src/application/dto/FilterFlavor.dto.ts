import { z } from "zod";

export const FilterFlavorSchema = z.object({
  name: z.string().optional(),
  shapeId: z.string().uuid("Shape ID must be a valid UUID").optional(),
  minPrice: z.preprocess(val => parseFloat(val as string), z.number().positive("Min price must be a positive number")).optional(),
  maxPrice: z.preprocess(val => parseFloat(val as string), z.number().positive("Max price must be a positive number")).optional(),
  limit: z.preprocess(val => parseInt(val as string, 10), z.number().int().positive("Limit must be a positive integer").optional()).default(10),
  offset: z.preprocess(val => parseInt(val as string, 10), z.number().int().min(0, "Offset cannot be negative").optional()).default(0),
});

export type FilterFlavorDTO = z.infer<typeof FilterFlavorSchema>;
