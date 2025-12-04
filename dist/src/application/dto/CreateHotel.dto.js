"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHotelSchema = void 0;
const zod_1 = require("zod");
// Helper function to parse service items from form-data
const parseServiceItems = (val) => {
    if (!val)
        return [];
    if (Array.isArray(val))
        return val;
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        }
        catch (_a) {
            return [];
        }
    }
    return [val]; // Handle single object case
};
// Schema for service items
const serviceItemSchema = zod_1.z.preprocess(parseServiceItems, zod_1.z.array(zod_1.z.object({
    name: zod_1.z.string().optional(),
    totalPrice: zod_1.z.preprocess((val) => (val === '' ? undefined : Number(val)), zod_1.z.number().min(0, "Price cannot be negative"))
})).default([]));
exports.CreateHotelSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    branchName: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().min(1),
    contactPerson: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional(),
    country: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    address: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    // Geo location (optional)
    latitude: zod_1.z
        .coerce
        .number()
        .min(-90, { message: "latitude must be >= -90" })
        .max(90, { message: "latitude must be <= 90" })
        .optional(),
    longitude: zod_1.z
        .coerce
        .number()
        .min(-180, { message: "longitude must be >= -180" })
        .max(180, { message: "longitude must be <= 180" })
        .optional(),
    status: zod_1.z.coerce.boolean(),
    rating: zod_1.z.coerce.number().optional(),
    price: zod_1.z.coerce.number().min(0, "Price cannot be negative").optional(),
    commissionRate: zod_1.z.coerce.number().optional(),
    contractStartDate: zod_1.z.coerce.date().optional(),
    contractEndDate: zod_1.z.coerce.date().optional(),
    contractDuration: zod_1.z.coerce.number().optional(),
    generalAmenities: zod_1.z.string().optional(),
    diningAmenities: zod_1.z.string().optional(),
    wellnessAmenities: zod_1.z.string().optional(),
    businessAmenities: zod_1.z.string().optional(),
    otherAmenities: zod_1.z.string().optional(),
    map: zod_1.z.string().url({ message: "صورة الطائرة يجب أن تكون رابطًا صالحًا" }).optional(),
    // New service fields
    meals: serviceItemSchema.optional(),
    unlimitedInternet: serviceItemSchema.optional(),
    airportTransfer: serviceItemSchema.optional(),
    amenities: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string()).optional()),
    ratings: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.string()).default([])),
    imageUrls: zod_1.z.array(zod_1.z.string()).optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
});
