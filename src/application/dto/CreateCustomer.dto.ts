   


import { z } from "zod";
export const CreateCustomerSchema = z.object(


  
  {
  // System Fields
  authUserId: z.string().uuid(),
  customerType: z.enum(["VIP", "Regular"]).optional(),
  registrationDate: z.date().or(z.string()).optional(),
  
  // Personal Information
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().or(z.date()).optional(),
  
  // Identification
  nationality: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().or(z.date()).optional(),
  nationalId: z.string().optional(),
  nationalIdExpiry: z.string().or(z.date()).optional(),
  
  // Address
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  
  // Location
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
  
  // Authentication & Preferences
  profilePicture: z.string().optional(), // Accepts any string path for file uploads
  locale: z.string().optional(),
  
  // Additional Fields
  customername: z.string().optional(),
  expirationDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), {
      message: "Invalid date",
    })
    .optional(),
});

export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>;
