import { z } from "zod";

export const CreateAirLineSchema = z.object({
  clientId: z.string().uuid(),
  companyName: z.string().min(1),
  phoneNumber: z.string(),
  // rating is optional; default to 0 when not provided
  rating: z.coerce.number().optional().default(0),
  email: z.string().email(),
  iataCode: z.string().length(2),
  country: z.string().min(1),
  city: z.string().min(1),
  flightType: z.enum(["international", "domestic"]),
  mealsAvailable: z.coerce.boolean(),
  specialOffers: z.coerce.boolean(),
  collaborationStartDate: z.coerce.date(),
  contractDuration: z.coerce.number(),
  commissionRate: z.coerce.number(),
  status: z.coerce.boolean(),
 airline_name: z.string().min(1), 
  airline_type: z.enum(["International", "Domestic", "Both"]),
  isCharter: z.coerce.boolean().optional(),

  contractStartDate: z.coerce.date().optional(),
  contractEndDate: z.coerce.date().optional(),

  additionalServices: z.string().optional(),
  specialAmenities: z.string().optional(),
  logoUrl: z.string().url().optional(),

  promotionalImages: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),

  documents: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),

  
  images: z.array(z.string()).optional(),


  features: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
  meals: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
});

export type CreateAirLineDTO = z.infer<typeof CreateAirLineSchema>;

