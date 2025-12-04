import { z } from "zod";

export const TripScheduleItem = z.object({
  day: z.number().int().min(1),
  title: z.string(),
  description: z.string(),
});

export const CreateTripSchema = z.object({
  clientId: z.string().uuid(),
  status: z.coerce.boolean(),
  name: z.string().min(1, 'Name is required'),
  rating: z.coerce.number().min(0).max(5).default(0),
  departure: z.string(),
  arrival: z.string(),
  tripDuration: z.string(),
  includesHotel: z.coerce.boolean(),
  includesFlight: z.coerce.boolean(),
  
  description: z.string().default(''),
  includeProgram: z.array(z.string()).default([]),
  noIncludeProgram: z.array(z.string()).default([]),
  price: z.coerce.number().min(0).default(0),
  days: z.coerce.number().int().min(1).default(1),
  departureDate: z.coerce.date(),
  returnDate: z.coerce.date(),

  schedule: z.array(TripScheduleItem).optional(),
  // Images are optional in the DTO but will be validated in the controller
  images: z.array(z.string()).optional(),
  hotels: z.array(z.string().uuid()).optional(),
  flights: z.array(z.string().uuid()).optional(),
});

export type CreateTripDTO = z.infer<typeof CreateTripSchema>;
