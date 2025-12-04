import { z } from "zod";

export const UpdateAirLineSchema = z.object({
  companyName: z.string().optional(),
  phoneNumber: z.string().optional(),
  rating: z.coerce.number().optional(),
  email: z.string().email().optional(),
  iataCode: z.string().length(2).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  flightType: z.enum(["international", "domestic"]).optional(),
  mealsAvailable: z.coerce.boolean().optional(),
  specialOffers: z.coerce.boolean().optional(),
  collaborationStartDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().optional()
  ),
  contractDuration: z.coerce.number().optional(),
  commissionRate: z.coerce.number().optional(),
  status: z.coerce.boolean().optional(),

  airline_name: z.string().optional(),
  airline_type: z.enum(["International", "Domestic", "Both"]).optional(),
  isCharter: z.coerce.boolean().optional(),

  contractStartDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().optional()
  ),
  contractEndDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().optional()
  ),

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
  newImages: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
  imagesToRemove: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
  featuresToRemove: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
  newFeatures: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
  newMeals: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
});

export type UpdateAirLineDTO = z.infer<typeof UpdateAirLineSchema>;
