import { z } from "zod";

export const FilterShapeSchema = z.object({
  name: z.string().optional(),
  numberOfPeople: z.preprocess(val => parseInt(val as string, 10), z.number().int().positive("Number of people must be a positive integer")).optional(),
  minPrice: z.preprocess(val => parseFloat(val as string), z.number().positive("Min price must be a positive number")).optional(),
  maxPrice: z.preprocess(val => parseFloat(val as string), z.number().positive("Max price must be a positive number")).optional(),
  limit: z.preprocess(val => parseInt(val as string, 10), z.number().int().positive("Limit must be a positive integer").optional()).default(10),
  offset: z.preprocess(val => parseInt(val as string, 10), z.number().int().min(0, "Offset cannot be negative").optional()).default(0),
});

export type FilterShapeDTO = z.infer<typeof FilterShapeSchema>;
