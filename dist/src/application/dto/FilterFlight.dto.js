"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterFlightSchema = void 0;
const zod_1 = require("zod");
exports.FilterFlightSchema = zod_1.z.object({
    // Basic filters
    clientId: zod_1.z.string().uuid({
        message: "يجب أن يكون معرف العميل صالحًا"
    }).optional(),
    status: zod_1.z.enum(["all", "active", "not_active"], {
        errorMap: () => ({ message: "حالة الرحلة يجب أن تكون: all, active, أو not_active" })
    }).default("all"),
    // Search filters
    name: zod_1.z.string({
        invalid_type_error: "يجب أن يكون اسم الرحلة نصيًا"
    }).optional(),
    flightNumber: zod_1.z.string({
        invalid_type_error: "يجب أن يكون رقم الرحلة نصيًا"
    }).optional(),
    departureCity: zod_1.z.string({
        invalid_type_error: "يجب أن تكون مدينة المغادرة نصية"
    }).optional(),
    arrivalCity: zod_1.z.string({
        invalid_type_error: "يجب أن تكون مدينة الوصول نصية"
    }).optional(),
    // Date filters
    flightDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'يجب أن يكون تاريخ الرحلة بتنسيق YYYY-MM-DD' }).optional(),
    // For backward compatibility and date range filtering
    departureDateFrom: zod_1.z.string().datetime({
        message: "يجب أن يكون تاريخ المغادرة بتنسيق صحيح"
    }).optional(),
    departureDateTo: zod_1.z.string().datetime({
        message: "يجب أن يكون تاريخ الانتهاء بتنسيق صحيح"
    }).optional(),
    // Rating filters
    minRating: zod_1.z.coerce.number({
        invalid_type_error: "يجب أن يكون الحد الأدنى للتقييم رقمًا"
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
    // Flight-specific filters
    airlineId: zod_1.z.string().uuid({
        message: "يجب أن يكون معرف الشركة الجوية صالحًا"
    }).optional(),
    maxStops: zod_1.z.coerce.number({
        invalid_type_error: "يجب أن يكون عدد التوقفات رقمًا"
    })
        .min(0, { message: "لا يمكن أن يقل عدد التوقفات عن 0" })
        .optional(),
    bookingClass: zod_1.z.enum(['economy', 'business', 'first'], {
        errorMap: () => ({ message: "فئة الحجز يجب أن تكون: economy, business, أو first" })
    }).optional(),
    // Amenities filters
    hasWifi: zod_1.z.boolean().optional(),
    hasEntertainment: zod_1.z.boolean().optional(),
    hasMeal: zod_1.z.boolean().optional(),
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
    sortBy: zod_1.z.enum(['price', 'departureTime', 'arrivalTime', 'duration', 'stops', 'airline'], {
        errorMap: () => ({ message: "حقل الترتيب يجب أن يكون: price, departureTime, arrivalTime, duration, stops, أو airline" })
    }).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc'], {
        errorMap: () => ({ message: "اتجاه الترتيب يجب أن يكون: asc أو desc" })
    }).default('asc'),
}).refine((data) => !(data.minPrice !== undefined && data.maxPrice !== undefined) || (data.maxPrice >= data.minPrice), {
    message: "يجب أن يكون الحد الأقصى للسعر أكبر من أو يساوي الحد الأدنى",
    path: ["maxPrice"]
}).refine((data) => !(data.departureDateFrom && data.departureDateTo) || (new Date(data.departureDateTo) >= new Date(data.departureDateFrom)), {
    message: "يجب أن يكون تاريخ الانتهاء بعد أو يساوي تاريخ البداية",
    path: ["departureDateTo"]
});
