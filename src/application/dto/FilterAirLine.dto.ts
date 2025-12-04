import { z } from "zod";

export const FilterAirLineSchema = z.object({
  clientId: z.string().uuid().optional(),
  status: z.enum(["all", "active", "not_active"]).optional(),
  name: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export type FilterAirLineDTO = z.infer<typeof FilterAirLineSchema>;
