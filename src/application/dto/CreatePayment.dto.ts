import { z } from "zod";

export const CreatePaymentSchema = z.object({
  clientId: z.string().uuid(),
  customerId: z.string().uuid(),
  reservationId: z.string().uuid().nullable().optional(),
  category: z.string(),
  transactionStatus: z.enum(["paid", "under_review", "cancelled"]),
  amount: z.number().positive(),
});

export type CreatePaymentDTO = z.infer<typeof CreatePaymentSchema>;
