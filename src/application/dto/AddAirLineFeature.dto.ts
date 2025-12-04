import { z } from "zod";

export const AddAirLineFeatureSchema = z.object({
  airLineId: z.string().uuid(),
  name: z.string().min(1),
});

export type AddAirLineFeatureDTO = z.infer<typeof AddAirLineFeatureSchema>;
