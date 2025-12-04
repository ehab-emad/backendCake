"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterTripSchema = void 0;
const zod_1 = require("zod");
exports.FilterTripSchema = zod_1.z.object({
    // Basic filters
    clientId: zod_1.z.string().uuid({
        message: "يجب أن يكون معرف العميل صالحًا"
    }).optional(),
    status: zod_1.z.enum(["all", "active", "not_active"], {
        errorMap: () => ({ message: "حالة الرحلة يجب أن تكون: all, active, أو not_active" })
    }).default("all"),
    // Search by name
    name: zod_1.z.string({
        invalid_type_error: "يجب أن يكون نص البحث نصيًا"
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
    sortBy: zod_1.z.enum(['price', 'rating', 'startDate'], {
        errorMap: () => ({ message: "حقل الترتيب يجب أن يكون: price, rating, أو startDate" })
    }).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc'], {
        errorMap: () => ({ message: 'يجب أن يكون ترتيب الفرز: asc أو desc' })
    }).default('asc'),
    // Trip filters
    arrivalDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'يجب أن يكون تاريخ الوصول بتنسيق YYYY-MM-DD' }).optional(),
    // Flight filters
    departureCity: zod_1.z.string({
        invalid_type_error: "يجب أن تكون مدينة المغادرة نصية"
    }).optional(),
    arrivalCity: zod_1.z.string({
        invalid_type_error: "يجب أن تكون مدينة الوصول نصية"
    }).optional(),
    flightDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'يجب أن يكون تاريخ الرحلة بتنسيق YYYY-MM-DD' }).optional(),
    // Month filter (accepts month names or numbers, case-insensitive)
    month: zod_1.z.union([
        zod_1.z.string()
            .transform(val => {
            const monthMap = {
                'january': 1, 'jan': 1, 'يناير': 1,
                'february': 2, 'feb': 2, 'فبراير': 2,
                'march': 3, 'mar': 3, 'مارس': 3,
                'april': 4, 'apr': 4, 'أبريل': 4,
                'may': 5, 'مايو': 5, 'ماي': 5,
                'june': 6, 'jun': 6, 'يونيو': 6,
                'july': 7, 'jul': 7, 'يوليو': 7,
                'august': 8, 'aug': 8, 'أغسطس': 8,
                'september': 9, 'sep': 9, 'سبتمبر': 9,
                'october': 10, 'oct': 10, 'أكتوبر': 10,
                'november': 11, 'nov': 11, 'نوفمبر': 11,
                'december': 12, 'dec': 12, 'ديسمبر': 12
            };
            const month = val.trim().toLowerCase();
            // If it's a number string, parse it
            if (/^\d+$/.test(month)) {
                const num = parseInt(month, 10);
                return num >= 1 && num <= 12 ? num : null;
            }
            // Otherwise look up the month name
            return monthMap[month] || null;
        })
            .refine(val => val !== null, {
            message: 'الرجاء إدخال اسم شهر صحيح (عربي/إنجليزي) أو رقم من 1 إلى 12'
        }),
        zod_1.z.number().int().min(1).max(12)
    ]).optional(),
    // For backward compatibility
    createdAtMonth: zod_1.z.coerce.number()
        .int()
        .min(1, { message: 'يجب أن يكون الشهر بين 1 و 12' })
        .max(12, { message: 'يجب أن يكون الشهر بين 1 و 12' })
        .optional(),
    createdAtYear: zod_1.z.coerce.number()
        .int()
        .min(2000, { message: 'يجب أن يكون السنة بعد عام 2000' })
        .max(2100, { message: 'يجب أن تكون السنة قبل عام 2100' })
        .optional(),
}).refine(data => !(data.createdAtMonth && !data.createdAtYear), {
    message: 'يجب توفير السنة عند تحديد شهر الإنشاء',
    path: ['createdAtMonth']
}).refine(data => !(data.createdAtYear && !data.createdAtMonth), {
    message: 'يجب توفير الشهر عند تحديد سنة الإنشاء',
    path: ['createdAtYear']
}).refine((data) => !(data.minPrice !== undefined && data.maxPrice !== undefined) ||
    (data.maxPrice !== null && data.minPrice !== null && data.maxPrice >= data.minPrice), {
    message: 'يجب أن يكون الحد الأقصى للسعر أكبر من أو يساوي الحد الأدنى',
    path: ['maxPrice']
}).refine((data) => !(data.minRating !== undefined && data.maxRating !== undefined) ||
    (data.maxRating !== null && data.minRating !== null && data.maxRating >= data.minRating), {
    message: 'يجب أن يكون الحد الأقصى للتقييم أكبر من أو يساوي الحد الأدنى',
    path: ['maxRating']
});
