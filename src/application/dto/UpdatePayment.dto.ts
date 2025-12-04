import { z } from "zod";

export const UpdatePaymentSchema = z
  .object({
    clientId: z.string().uuid().optional(),
    customerId: z.string().uuid().optional(),
    reservationId: z.string().uuid().optional(),
    category: z.string().min(1).optional(),
    transactionStatus: z.enum(["paid", "under_review", "cancelled"]).optional(),
    amount: z.number().positive().optional(),
  })
  .refine((dto) => Object.keys(dto).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdatePaymentDTO = z.infer<typeof UpdatePaymentSchema>;
