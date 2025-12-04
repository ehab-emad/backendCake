import { z } from "zod";

export const CreateMamoPaymentSchema = z.object({
  amount: z
    .number()
    .positive()
    .describe("Total amount, in the smallest currency unit (e.g. 100.00)"),
  currency: z.string().length(3).describe("ISO 4217 currency code"),
  title: z
    .string()
    .optional()
    .describe("A short title displayed on the payment page"),
  description: z
    .string()
    .optional()
    .describe("Detailed description for the payment"),
  callbackUrl: z
    .string()
    .url()
    .optional()
    .describe("Webhook endpoint for payment status changes"),
  redirectUrl: z
    .string()
    .url()
    .describe("Where we send the user after payment completion"),
  metadata: z
    .object({
      reservationId: z.string().optional(),
      customerId: z.string().optional(),
      clientId: z.string().optional(),
    })
    .optional()
    .describe("Any extra info you want back in the webhook"),
});

export type CreateMamoPaymentDTO = z.infer<typeof CreateMamoPaymentSchema>;
