import { z } from "zod";
import { PaymentGateway } from "../../core/types/payment.types";

export const InitiatePaymentSchema = z.object({
  reservationId: z.string().uuid(),
  gateway: z.enum(["stripe", "tamara", "mimo"]),
  method: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type InitiatePaymentDTO = z.infer<typeof InitiatePaymentSchema>;
