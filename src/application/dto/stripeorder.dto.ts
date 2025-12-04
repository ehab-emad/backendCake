import { z } from "zod";

export const CreateStripeOrderSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().min(1),
  customerEmail: z.string().email(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  productName: z.string().optional(),
  clientId: z.string().min(1),
});
export type CreateStripeOrderDTO = z.infer<typeof CreateStripeOrderSchema>;

export const RefundStripeOrderSchema = z.object({
  paymentIntent: z.string().min(1),
  amount: z.number().optional(),
  comment: z.string().optional(),
});
export type RefundStripeOrderDTO = z.infer<typeof RefundStripeOrderSchema>;

export const CaptureStripeOrderSchema = z.object({
  orderId: z.string().min(1), // ده غالبًا الـ paymentIntent ID
  amount: z.number().min(1),
  currency: z.string().min(1),
});
export type CaptureStripeOrderDTO = z.infer<typeof CaptureStripeOrderSchema>;