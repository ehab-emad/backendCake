"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAirLineSchema = void 0;
const zod_1 = require("zod");
exports.CreateAirLineSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid(),
    companyName: zod_1.z.string().min(1),
    phoneNumber: zod_1.z.string(),
    // rating is optional; default to 0 when not provided
    rating: zod_1.z.coerce.number().optional().default(0),
    email: zod_1.z.string().email(),
    iataCode: zod_1.z.string().length(2),
    country: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    flightType: zod_1.z.enum(["international", "domestic"]),
    mealsAvailable: zod_1.z.coerce.boolean(),
    specialOffers: zod_1.z.coerce.boolean(),
    collaborationStartDate: zod_1.z.coerce.date(),
    contractDuration: zod_1.z.coerce.number(),
    commissionRate: zod_1.z.coerce.number(),
    status: zod_1.z.coerce.boolean(),
    airline_name: zod_1.z.string().min(1),
    airline_type: zod_1.z.enum(["International", "Domestic", "Both"]),
    isCharter: zod_1.z.coerce.boolean().optional(),
    contractStartDate: zod_1.z.coerce.date().optional(),
    contractEndDate: zod_1.z.coerce.date().optional(),
    additionalServices: zod_1.z.string().optional(),
    specialAmenities: zod_1.z.string().optional(),
    logoUrl: zod_1.z.string().url().optional(),
    promotionalImages: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string()).optional()),
    documents: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string()).optional()),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    features: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string()).optional()),
    meals: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string()).optional()),
});
