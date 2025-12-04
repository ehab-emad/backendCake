import { z } from "zod";

export const AddAirLineMealSchema = z.object({
  airLineId: z.string().uuid(),
  name: z.string().min(1),
});

export type AddAirLineMealDTO = z.infer<typeof AddAirLineMealSchema>;
