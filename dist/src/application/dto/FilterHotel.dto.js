"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterHotelSchema = void 0;
const zod_1 = require("zod");
exports.FilterHotelSchema = zod_1.z.object({
    // Basic filters
    clientId: zod_1.z.string().uuid({
        message: "يجب أن يكون معرف العميل صالحًا"
    }).optional(),
    status: zod_1.z.enum(["all", "active", "not_active"], {
        errorMap: () => ({ message: "حالة الفندق يجب أن تكون: all, active, أو not_active" })
    }).default("all"),
    // Search by name, location, or city
    name: zod_1.z.string({
        invalid_type_error: "يجب أن يكون نص البحث نصيًا"
    }).optional(),
    location: zod_1.z.string({
        invalid_type_error: "يجب أن يكون الموقع نصيًا"
    }).optional(),
    city: zod_1.z.string({
        invalid_type_error: "يجب أن تكون المدينة نصية"
    }).optional(),
    // Rating filters
    minRating: zod_1.z.coerce.number({
        invalid_type_error: "يجب أن يكون الحد الأدنى للتقييم رقمًا"
    })
        .min(0, { message: "لا يمكن أن يقل التقييم عن 0" })
        .max(5, { message: "لا يمكن أن يزيد التقييم عن 5" })
        .optional(),
    maxRating: zod_1.z.coerce.number({
        invalid_type_error: "يجب أن يكون الحد الأقصى للتقييم رقمًا"
    })
        .min(0, { message: "لا يمكن أن يقل التقييم عن 0" })
        .max(5, { message: "لا يمكن أن يزيد التقييم عن 5" })
        .optional(),
    // Price filters
    minPrice: zod_1.z.coerce.number({
        invalid_type_error: "يجب أن يكون الحد الأدنى للسعر رقمًا"
    })
        .min(0, { message: "لا يمكن أن يقل السعر عن 0" })
        .optional(),
    maxPrice: zod_1.z.coerce.number({
        invalid_type_error: "يجب أن يكون الحد الأقصى للسعر رقمًا"
    })
        .min(0, { message: "لا يمكن أن يقل السعر عن 0" })
        .optional(),
    // Amenities filter (comma-separated list)
    amenities: zod_1.z.string().optional(),
    // Room type filter (comma-separated list)
    roomTypes: zod_1.z.string().optional(),
    // Pagination
    page: zod_1.z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), zod_1.z.number({
        invalid_type_error: "يجب أن يكون رقم الصفحة رقمًا صحيحًا"
    })
        .int({ message: "يجب أن يكون رقم الصفحة رقمًا صحيحًا" })
        .min(1, { message: "لا يمكن أن يقل رقم الصفحة عن 1" })
        .default(1)),
    limit: zod_1.z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), zod_1.z.number({
        invalid_type_error: "يجب أن يكون الحد الأقصى للعناصر رقمًا صحيحًا"
    })
        .int({ message: "يجب أن يكون الحد الأقصى للعناصر رقمًا صحيحًا" })
        .min(1, { message: "لا يمكن أن يقل الحد الأقصى للعناصر عن 1" })
        .max(100, { message: "لا يمكن أن يزيد الحد الأقصى للعناصر عن 100" })
        .default(20)),
    // Sorting
    sortBy: zod_1.z.enum(['price', 'rating', 'name'], {
        errorMap: () => ({ message: "حقل الترتيب يجب أن يكون: price, rating, أو name" })
    }).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc'], {
        errorMap: () => ({ message: "اتجاه الترتيب يجب أن يكون: asc أو desc" })
    }).default('asc'),
}).refine((data) => !(data.minPrice !== undefined && data.maxPrice !== undefined) || (data.maxPrice >= data.minPrice), {
    message: "يجب أن يكون الحد الأقصى للسعر أكبر من أو يساوي الحد الأدنى",
    path: ["maxPrice"]
}).refine((data) => !(data.minRating !== undefined && data.maxRating !== undefined) || (data.maxRating >= data.minRating), {
    message: "يجب أن يكون الحد الأقصى للتقييم أكبر من أو يساوي الحد الأدنى",
    path: ["maxRating"]
});
