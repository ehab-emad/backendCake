"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTripSchema = void 0;
const zod_1 = require("zod");
const CreateTrip_dto_1 = require("./CreateTrip.dto");
const TripUpsert = CreateTrip_dto_1.CreateTripSchema.partial();
exports.UpdateTripSchema = TripUpsert.extend({
    newSchedule: zod_1.z.array(CreateTrip_dto_1.TripScheduleItem).optional(),
    name: zod_1.z.string().optional(),
    newImages: zod_1.z.array(zod_1.z.string()).optional(),
    newHotels: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    includesHotel: zod_1.z.coerce.boolean().optional(),
    includesFlight: zod_1.z.coerce.boolean().optional(),
    rating: zod_1.z.coerce.number().min(0).max(5).optional(),
    description: zod_1.z.string().optional(),
    includeProgram: zod_1.z.array(zod_1.z.string()).optional(),
    noIncludeProgram: zod_1.z.array(zod_1.z.string()).optional(),
    price: zod_1.z.coerce.number().min(0).optional(),
    days: zod_1.z.coerce.number().int().min(1).optional(),
    departureDate: zod_1.z.coerce.date().optional(),
    returnDate: zod_1.z.coerce.date().optional(),
    schedule: zod_1.z.array(CreateTrip_dto_1.TripScheduleItem).optional(),
    newFlights: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    // flights: z.array(z.string().uuid()).optional(), // Add flights field for replacing all flights
});
