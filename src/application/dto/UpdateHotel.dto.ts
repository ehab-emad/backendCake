import { z } from "zod";

// Helper function to parse service items from form-data
const parseServiceItems = (val: any) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return [val]; // Handle single object case
};

// Schema for service items
const serviceItemSchema = z.preprocess(
  parseServiceItems,
  z.array(z.object({
    name: z.string().optional(),
    totalPrice: z.preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z.number().min(0, "Price cannot be negative")
    )
  })).default([])
);

export const UpdateHotelSchema = z.object({
  name: z.string().optional(),
  branchName: z.string().optional(),
  contactNumber: z.string().optional(),
  contactPerson: z.string().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),

  // Geo location (optional)
  latitude: z
    .coerce
    .number()
    .min(-90, { message: "latitude must be >= -90" })
    .max(90, { message: "latitude must be <= 90" })
    .optional(),
  longitude: z
    .coerce
    .number()
    .min(-180, { message: "longitude must be >= -180" })
    .max(180, { message: "longitude must be <= 180" })
    .optional(),

  status: z.coerce.boolean().optional(),
  rating: z.coerce.number().optional(),
  price: z.coerce.number().min(0, "Price cannot be negative").optional(),
  commissionRate: z.coerce.number().optional(),

  contractStartDate: z.coerce.date().optional(),
  contractEndDate: z.coerce.date().optional(),

  generalAmenities: z.string().optional(),
  diningAmenities: z.string().optional(),
  wellnessAmenities: z.string().optional(),
  businessAmenities: z.string().optional(),
  otherAmenities: z.string().optional(),
  map: z.string().url({ message: "صورة الطائرة يجب أن تكون رابطًا صالحًا" }).optional(),
  
  // New service fields
  meals: serviceItemSchema.optional(),
  unlimitedInternet: serviceItemSchema.optional(),
  airportTransfer: serviceItemSchema.optional(),
  
  newImages: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
  imagesToRemove: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
  // Ratings are managed separately and should not be updated through the main update endpoint
  amenities: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    },
    z.array(z.string()).optional()
  ),

  // اختياري إذا أردت أيضًا دعم حذف المرافق بشكل انتقائي
  amenitiesToRemove: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    },
    z.array(z.string()).optional()
  ),
});

export type UpdateHotelDTO = z.infer<typeof UpdateHotelSchema>