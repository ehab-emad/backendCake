import { z } from "zod";
import { CreateTripSchema, TripScheduleItem } from "./CreateTrip.dto";

const TripUpsert = CreateTripSchema.partial();

export const UpdateTripSchema = TripUpsert.extend({
  newSchedule: z.array(TripScheduleItem).optional(),
  name: z.string().optional(),
  newImages: z.array(z.string()).optional(),
  newHotels: z.array(z.string().uuid()).optional(),
  includesHotel: z.coerce.boolean().optional(),
  includesFlight: z.coerce.boolean().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  description: z.string().optional(),
  includeProgram: z.array(z.string()).optional(),
  noIncludeProgram: z.array(z.string()).optional(),
  price: z.coerce.number().min(0).optional(),
  days: z.coerce.number().int().min(1).optional(),
  departureDate: z.coerce.date().optional(),
  returnDate: z.coerce.date().optional(),
  schedule: z.array(TripScheduleItem).optional(),
  newFlights: z.array(z.string().uuid()).optional(),
  // flights: z.array(z.string().uuid()).optional(), // Add flights field for replacing all flights
});

export type UpdateTripDTO = z.infer<typeof UpdateTripSchema>;
