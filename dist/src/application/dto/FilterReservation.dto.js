"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterReservationSchema = void 0;
const zod_1 = require("zod");
exports.FilterReservationSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid({
        message: "يجب أن يكون معرف العميل صالحًا"
    }).optional(),
    customerId: zod_1.z.string().uuid({
        message: "يجب أن يكون معرف العميل صالحًا"
    }).optional(),
    status: zod_1.z.enum(["pending", "confirmed", "cancelled", "completed"], {
        errorMap: () => ({ message: "حالة الحجز يجب أن تكون: pending, confirmed, cancelled, أو completed" })
    }).optional(),
    serviceType: zod_1.z.enum(["room", "flight", "trip"], {
        errorMap: () => ({ message: "نوع الخدمة يجب أن تكون: room, flight, أو trip" })
    }).optional(),
    category: zod_1.z.string({
        invalid_type_error: "يجب أن يكون التصنيف نصيًا"
    }).optional(),
    fromDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "fromDate must be YYYY-MM-DD")
        .transform((s) => new Date(s))
        .optional(),
    toDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "toDate must be YYYY-MM-DD")
        .transform((s) => new Date(s))
        .optional(),
    departureDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "departureDate must be YYYY-MM-DD")
        .transform((s) => new Date(s))
        .optional(),
    returnDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "returnDate must be YYYY-MM-DD")
        .transform((s) => new Date(s))
        .optional(),
    page: zod_1.z.string().transform(Number).optional(),
    limit: zod_1.z.string().transform(Number).optional(),
    customerType: zod_1.z.enum(["VIP", "Regular"]).optional(),
});
