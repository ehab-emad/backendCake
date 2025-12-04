import { z } from "zod";

export const CreateEmployeeSchema = z.object({
  clientId: z.string().uuid({ message: "معرف العميل مطلوب" }),
  role: z.string().min(1, { message: "الدور الوظيفي مطلوب" }),
  active: z.boolean().default(true),
  
  // Required fields
  address: z.string().min(1, { message: "العنوان مطلوب" }),
  phoneNumber: z.string().min(1, { message: "رقم الهاتف مطلوب" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }).min(1, { message: "البريد الإلكتروني مطلوب" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل" }),
  
  // Optional fields
  website: z.string().url({ message: "الرابط غير صالح" }).optional(),
  additionalPhoneNumber: z.string().optional(),
  
  // Media fields
  profileImage: z.string().optional(),
  images: z
    .preprocess(
      (v) => (typeof v === "string" ? JSON.parse(v) : v),
      z.array(z.string()).optional().default([])
    )
    .optional()
    .default([]),
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;
