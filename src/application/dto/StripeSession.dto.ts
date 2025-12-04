import { z } from "zod";

export const CreateStripeSessionSchema = z.object({
  amount: z.number().gt(0),
  currency: z.string().min(3).max(3),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  agencyAccountId: z.string().optional(),
  commissionAmount: z.number().optional(),
});

export type CreateStripeSessionDTO = z.infer<typeof CreateStripeSessionSchema>;
