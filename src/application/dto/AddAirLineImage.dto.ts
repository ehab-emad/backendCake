import { z } from "zod";

export const AddAirLineImageSchema = z.object({
  airLineId: z.string().uuid(),
  path: z.string().min(1),
});

export type AddAirLineImageDTO = z.infer<typeof AddAirLineImageSchema>;
