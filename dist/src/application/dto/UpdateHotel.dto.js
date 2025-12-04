"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHotelSchema = void 0;
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
exports.UpdateHotelSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    branchName: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    contactPerson: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
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
    status: zod_1.z.coerce.boolean().optional(),
    rating: zod_1.z.coerce.number().optional(),
    price: zod_1.z.coerce.number().min(0, "Price cannot be negative").optional(),
    commissionRate: zod_1.z.coerce.number().optional(),
    contractStartDate: zod_1.z.coerce.date().optional(),
    contractEndDate: zod_1.z.coerce.date().optional(),
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
    newImages: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string()).optional()),
    imagesToRemove: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string()).optional()),
    // Ratings are managed separately and should not be updated through the main update endpoint
    amenities: zod_1.z.preprocess((val) => {
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            }
            catch (_a) {
                return [];
            }
        }
        return val;
    }, zod_1.z.array(zod_1.z.string()).optional()),
    // اختياري إذا أردت أيضًا دعم حذف المرافق بشكل انتقائي
    amenitiesToRemove: zod_1.z.preprocess((val) => {
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            }
            catch (_a) {
                return [];
            }
        }
        return val;
    }, zod_1.z.array(zod_1.z.string()).optional()),
});
