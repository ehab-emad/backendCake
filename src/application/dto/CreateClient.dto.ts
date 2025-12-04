import { z } from "zod";

export const CreateClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address: z.string().optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  licenseNumber: z.string().optional(),
  city: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  additionalPhoneNumber: z.string().optional(),
  subscriptionType: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  approved: z.boolean().optional(),
  active: z.boolean().optional(),
});

export type CreateClientDto = z.infer<typeof CreateClientSchema>;
