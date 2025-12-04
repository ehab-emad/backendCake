"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTripSchema = exports.TripScheduleItem = void 0;
const zod_1 = require("zod");
exports.TripScheduleItem = zod_1.z.object({
    day: zod_1.z.number().int().min(1),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
});
exports.CreateTripSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid(),
    status: zod_1.z.coerce.boolean(),
    name: zod_1.z.string().min(1, 'Name is required'),
    rating: zod_1.z.coerce.number().min(0).max(5).default(0),
    departure: zod_1.z.string(),
    arrival: zod_1.z.string(),
    tripDuration: zod_1.z.string(),
    includesHotel: zod_1.z.coerce.boolean(),
    includesFlight: zod_1.z.coerce.boolean(),
    description: zod_1.z.string().default(''),
    includeProgram: zod_1.z.array(zod_1.z.string()).default([]),
    noIncludeProgram: zod_1.z.array(zod_1.z.string()).default([]),
    price: zod_1.z.coerce.number().min(0).default(0),
    days: zod_1.z.coerce.number().int().min(1).default(1),
    departureDate: zod_1.z.coerce.date(),
    returnDate: zod_1.z.coerce.date(),
    schedule: zod_1.z.array(exports.TripScheduleItem).optional(),
    // Images are optional in the DTO but will be validated in the controller
    images: zod_1.z.array(zod_1.z.string()).optional(),
    hotels: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    flights: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
