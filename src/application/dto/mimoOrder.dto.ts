// src/application/dto/MimoOrder.dto.ts
import { z } from "zod";


export const CreateMimoOrderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3), // زي AED أو SAR
  screen_type: z.enum(["checkout", "embedded", "payment_link"]).default("checkout"),
  description: z.string(),

  capture_method: z.enum(["AUTOMATIC", "MANUAL"]).default("AUTOMATIC"), // ✅ تمت الإضافة

  customer: z.object({
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    phone_number: z.string(),
  }),

  callback_urls: z.object({
    success: z.string().url(),
    cancel: z.string().url(),
    failure: z.string().url(),
    notification: z.string().url(),
  }),

  metadata: z.record(z.string()).optional(), // ✅ تمت الإضافة
});



export const CaptureMimoOrderSchema = z.object({
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number"
  }).positive("Amount must be greater than zero"),
});


export const CancelMimoOrderSchema = z.object({
  paymentId: z.string(),
  reason: z.string().optional(),
});


export const RefundMimoOrderSchema = z.object({
  paymentId: z.string(),
  amount: z.number(),
  reason: z.string().optional(),
});


export const CreateMamoLinkSchema = z.object({
  title: z.string(),
  amount: z.number().positive(),
  capture_method:z.string().default("MANUAL"),
  currency: z.string().default("AED"),
  return_url: z.string().url().optional(),
  hold_and_charge_later: z.boolean().optional(),
});



export type CreateMamoLinkDTO = z.infer<typeof CreateMamoLinkSchema>;
export type CreateMimoOrderDTO = z.infer<typeof CreateMimoOrderSchema>;
export type CaptureMimoOrderDTO = z.infer<typeof CaptureMimoOrderSchema>;
export type CancelMimoOrderDTO = z.infer<typeof CancelMimoOrderSchema>;
export type RefundMimoOrderDTO = z.infer<typeof RefundMimoOrderSchema>;
