import { z } from "zod";

export const UpdateEmployeeSchema = z.object({
  // Required fields
  role: z.string().min(1, { message: "الدور الوظيفي مطلوب" }),
  address: z.string().min(1, { message: "العنوان مطلوب" }),
  phoneNumber: z.string().min(1, { message: "رقم الهاتف مطلوب" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }).min(1, { message: "البريد الإلكتروني مطلوب" }),
  
  // Optional fields
  website: z.string().url({ message: "الرابط غير صالح" }).optional(),
  additionalPhoneNumber: z.string().optional(),
  
  // Media fields
  profileImage: z.string().optional(),
  newImages: z
    .preprocess(
      (v) => (typeof v === "string" ? JSON.parse(v) : v),
      z.array(z.string()).optional().default([])
    )
    .optional()
    .default([]),
    
  // Status
  active: z.boolean().default(true).optional(),
});

export type UpdateEmployeeDTO = z.infer<typeof UpdateEmployeeSchema>;
