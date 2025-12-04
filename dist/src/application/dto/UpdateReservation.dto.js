"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReservationSchema = void 0;
const zod_1 = require("zod");
exports.UpdateReservationSchema = zod_1.z
    .object({
    reservationNumber: zod_1.z.string().optional(),
    status: zod_1.z
        .enum(["pending", "confirmed", "cancelled", "completed"])
        .optional(),
    clientId: zod_1.z.string().uuid().optional(),
    customerId: zod_1.z.string().uuid().optional(),
    serviceType: zod_1.z.enum(["room", "flight", "trip"]).optional(),
    serviceId: zod_1.z.string().uuid().optional(),
    fromDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "fromDate must be YYYY-MM-DD")
        .optional(),
    toDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "toDate must be YYYY-MM-DD")
        .optional(),
    adult: zod_1.z.number().int().nonnegative().optional(),
    children: zod_1.z.number().int().nonnegative().optional(),
    infant: zod_1.z.number().int().nonnegative().optional(),
    rooms: zod_1.z.number().int().positive().optional(),
    price: zod_1.z.number().nonnegative().optional(),
    seat: zod_1.z.preprocess((val) => {
        if (!val)
            return [];
        if (Array.isArray(val))
            return val;
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            }
            catch (_a) {
                return [val]; // Return as single item array if not valid JSON
            }
        }
        return [];
    }, zod_1.z.array(zod_1.z.string()).default([])),
    // كراسي الرحلة الأساسية
    mainFlightSeats: zod_1.z.preprocess((val) => {
        if (!val)
            return [];
        if (Array.isArray(val))
            return val;
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            }
            catch (_a) {
                return [val]; // Return as single item array if not valid JSON
            }
        }
        return [];
    }, zod_1.z.array(zod_1.z.string()).default([]).optional()),
    // كراسي الرحلات الترانزيت
    transitFlightSeats: zod_1.z.preprocess((val) => {
        if (!val)
            return [];
        if (Array.isArray(val))
            return val;
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            }
            catch (_a) {
                return [val]; // Return as single item array if not valid JSON
            }
        }
        return [];
    }, zod_1.z.array(zod_1.z.string()).default([]).optional()),
    // كراسي رحلات العودة
    returnFlightSeats: zod_1.z.preprocess((val) => {
        if (!val)
            return [];
        if (Array.isArray(val))
            return val;
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            }
            catch (_a) {
                return [val]; // Return as single item array if not valid JSON
            }
        }
        return [];
    }, zod_1.z.array(zod_1.z.string()).default([]).optional()),
    baggage: zod_1.z.string().optional(),
    // Service items - handle both stringified JSON and direct objects
    meals: zod_1.z.preprocess((val) => (typeof val === 'string' ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.number().min(0, "Price cannot be negative")
    })).default([]).optional()),
    extraBaggage: zod_1.z.preprocess((val) => (typeof val === 'string' ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.number().min(0, "Price cannot be negative")
    })).default([]).optional()),
    airportTransfer: zod_1.z.preprocess((val) => (typeof val === 'string' ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.number().min(0, "Price cannot be negative")
    })).default([]).optional()),
    unlimitedInternet: zod_1.z.preprocess((val) => (typeof val === 'string' ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.number().min(0, "Price cannot be negative")
    })).default([]).optional()),
    extras: zod_1.z.string().optional(),
    // New customer details fields
    name: zod_1.z.string().min(2).max(255).optional().nullable(),
    email: zod_1.z.string().email().optional().nullable(),
    gender: zod_1.z.enum(['male', 'female', 'other']).optional().nullable(),
    latitude: zod_1.z.number().min(-90).max(90).optional().nullable(),
    longitude: zod_1.z.number().min(-180).max(180).optional().nullable(),
    nationality: zod_1.z.string().max(100).optional().nullable(),
    passportNumber: zod_1.z.string().max(50).optional().nullable(),
    passportExpiry: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'passportExpiry must be YYYY-MM-DD').optional().nullable(),
    phoneNumber: zod_1.z.string().max(20).optional().nullable(),
    dateOfBirth: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dateOfBirth must be YYYY-MM-DD').optional().nullable(),
    departureDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'departureDate must be YYYY-MM-DD').optional().nullable(),
    returnDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'returnDate must be YYYY-MM-DD').optional().nullable(),
})
    .refine((data) => {
    if (data.serviceType === "room") {
        return data.fromDate !== undefined && data.toDate !== undefined;
    }
    if (data.serviceType === "flight") {
        return (data.adult !== undefined &&
            data.children !== undefined &&
            data.seat !== undefined &&
            data.baggage !== undefined &&
            data.meals !== undefined &&
            data.extraBaggage !== undefined &&
            data.airportTransfer !== undefined &&
            data.unlimitedInternet !== undefined);
    }
    return Object.keys(data).length > 0;
}, {
    message: "— switching to room needs fromDate & toDate; — switching to flight needs adult, children, seat, baggage, meals, extraBaggage, airportTransfer & unlimitedInternet",
    path: [
        "fromDate",
        "toDate",
        "adult",
        "children",
        "seat",
        "baggage",
        "meals",
        "extraBaggage",
        "airportTransfer",
        "unlimitedInternet",
    ],
})
    .refine((data) => {
    if (data.passportExpiry) {
        const expiryDate = new Date(data.passportExpiry);
        const today = new Date();
        return expiryDate > today;
    }
    return true;
}, {
    message: "Passport must not be expired",
    path: ["passportExpiry"],
})
    .refine((data) => {
    if (data.dateOfBirth) {
        const birthDate = new Date(data.dateOfBirth);
        const today = new Date();
        return birthDate < today;
    }
    return true;
}, {
    message: "Date of birth must be in the past",
    path: ["dateOfBirth"],
});
