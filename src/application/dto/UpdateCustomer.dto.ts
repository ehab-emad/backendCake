import { z } from "zod";

export const UpdateCustomerSchema = z.object({
  // File upload will be handled separately by multer
  authUserId: z.string().uuid().optional(),
  customerType: z.enum(["VIP", "Regular"]).optional(),
  nationality: z.string().optional(),
  customername: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  passportNumber: z.string().optional(),
  nationalId: z.string().optional(),
  nationalIdExpiry: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), {
      message: "Invalid national ID expiry date",
    })
    .optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  // Profile picture will be handled by multer middleware
  profilePicture: z.string().optional(),
  locale: z.string().optional(),
  gender: z.string().optional(),
  // Name fields for better personalization
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  latitude: z.coerce
    .number()
    .min(-90, { message: "latitude must be >= -90" })
    .max(90, { message: "latitude must be <= 90" })
    .optional(),
  longitude: z.coerce
    .number()
    .min(-180, { message: "longitude must be >= -180" })
    .max(180, { message: "longitude must be <= 180" })
    .optional(),
  // Date fields with validation
  dateOfBirth: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), {
      message: "Invalid date of birth",
    })
    .optional(),
  passportExpiry: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), {
      message: "Invalid passport expiry date",
    })
    .optional(),
  registrationDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), {
      message: "Invalid registration date",
    })
    .optional(),
  expirationDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), {
      message: "Invalid expiration date",
    })
    .optional(),
  // Alias for backward compatibility
  name: z.string().optional(),
});
export type UpdateCustomerDTO = z.infer<typeof UpdateCustomerSchema>;
