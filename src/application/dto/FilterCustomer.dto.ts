import { z } from "zod";

export const FilterCustomerSchema = z.object({
  clientId: z.string().uuid().optional(),

  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(20),
});

export type FilterCustomerDTO = z.infer<typeof FilterCustomerSchema>;
