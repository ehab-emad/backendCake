import { z } from "zod";

export const MoneySchema = z.object({
  amount: z.number(),
  currency: z.string(),
});
export type Money = z.infer<typeof MoneySchema>;

export const DiscountSchema = z
  .object({
    amount: MoneySchema,
    name: z.string(),
  })
  .nullable()
  .optional();
export type Discount = z.infer<typeof DiscountSchema>;

export const ItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  referenceId: z.string(),
  sku: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: MoneySchema,
  totalAmount: MoneySchema,
  taxAmount: MoneySchema,
  discountAmount: MoneySchema.optional(),
  itemUrl: z.string().url(),
  imageUrl: z.string().url(),
});
export type Item = z.infer<typeof ItemSchema>;

export const ConsumerSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
});
export type Consumer = z.infer<typeof ConsumerSchema>;

export const AddressSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  region: z.string(),
  postalCode: z.string(),
  countryCode: z.string(),
  phoneNumber: z.string(),
});
export type Address = z.infer<typeof AddressSchema>;

export const MerchantUrlSchema = z.object({
  cancel: z.string().url(),
  failure: z.string().url(),
  success: z.string().url(),
  notification: z.string().url(),
});
export const CancelTamaraOrderSchema = z.object({
  orderId: z.string(),
  cancelReason: z.string().optional(), // Tamara مش شرط تحط سبب، لكن اختياري
  
  amount: z.number(),           // ⬅️ إضافة
  currency: z.string()  
});
export const RefundTamaraOrderSchema = z.object({
  orderId: z.string(),
  amount: z.number(),
  currency: z.string(),
   comment: z.string(), // ✅ تم إضافتها
  reason: z.string().optional(),
});



export type MerchantUrl = z.infer<typeof MerchantUrlSchema>;

export const CreateTamaraOrderSchema = z.object({
  totalAmount: MoneySchema,
  shippingAmount: MoneySchema,
  taxAmount: MoneySchema,



  orderReferenceId: z.string(),
  orderNumber: z.string(),

  discount: DiscountSchema,

  items: z.array(ItemSchema).min(1),

  consumer: ConsumerSchema,

  countryCode: z.string(),
  description: z.string().optional(),

  merchantUrl: MerchantUrlSchema,

  paymentType: z.enum(["PAY_LATER", "FULL_PAYMENT"]),
  instalments: z.number().int().positive().optional(),

  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,

  platform: z.enum(["WEB", "MOBILE_APP"]).optional(),
  isMobile: z.boolean().optional(),
  locale: z.string().optional(),
  riskAssessment: z.any().optional(),
  additionalData: z.record(z.string(), z.string()).optional(),
});
export const CaptureTamaraOrderSchema = z.object({

  amount: z.number(),
  currency: z.string(),
  shippingAmount: z.number().optional(),
  taxAmount: z.number().optional(),
  discountAmount: z.number().optional(),
  description: z.string().optional(),
});

export type CaptureTamaraOrderDTO = z.infer<typeof CaptureTamaraOrderSchema>;

export type CreateTamaraOrderDTO = z.infer<typeof CreateTamaraOrderSchema>;
export type CancelTamaraOrderDTO = z.infer<typeof CancelTamaraOrderSchema>;
export type RefundTamaraOrderDTO = z.infer<typeof RefundTamaraOrderSchema>;