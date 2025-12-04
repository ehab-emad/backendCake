import { z } from "zod";

const parseOptionalNumber = (val: any) => {
  if (val === null || val === undefined || val === '') {
    return undefined;
  }
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

export const FilterProductSchema = z.object({
  page: z.preprocess(parseOptionalNumber, z.number().int().positive().optional().default(1)),
  limit: z.preprocess(parseOptionalNumber, z.number().int().positive().optional().default(10)),
  name: z.string().optional(),
  description: z.string().optional(),
  minPrice: z.preprocess(parseOptionalNumber, z.number().positive().optional()),
  maxPrice: z.preprocess(parseOptionalNumber, z.number().positive().optional()),
  status: z.string().optional(),
  minRating: z.preprocess(parseOptionalNumber, z.number().min(0).max(5).optional()),
  maxRating: z.preprocess(parseOptionalNumber, z.number().min(0).max(5).optional()),
  material: z.string().optional(),
  beads: z.string().optional(),
  length: z.string().optional(),
  weight: z.string().optional(),
  search: z.string().optional(), // General search term
});

export type FilterProductDTO = z.infer<typeof FilterProductSchema>;
