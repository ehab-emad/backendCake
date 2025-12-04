"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReservationSchema = void 0;
const zod_1 = require("zod");
exports.CreateReservationSchema = zod_1.z
    .object({
    clientId: zod_1.z.string().uuid(),
    customerId: zod_1.z.string().uuid(),
    serviceType: zod_1.z.enum(["room", "flight", "trip"]),
    serviceId: zod_1.z.string().uuid(),
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
    infant: zod_1.z.number().int().nonnegative().default(0).optional(),
    rooms: zod_1.z.number().int().positive().default(1).optional(),
    price: zod_1.z.number().nonnegative().default(0).optional(),
    seat: zod_1.z.custom((val) => {
        // If value is not provided, it's valid (optional)
        if (val === undefined || val === null)
            return true;
        // If it's an array, it's valid if empty or contains valid strings
        if (Array.isArray(val))
            return true;
        // If it's a string, it's valid (even empty)
        if (typeof val === 'string')
            return true;
        return false;
    }, { message: 'Seat must be a string or array of strings' }).transform((val) => {
        if (!val)
            return []; // Handle null/undefined
        if (Array.isArray(val))
            return val;
        if (typeof val === 'string')
            return val.split(',').map(s => s.trim()).filter(Boolean);
        return [];
    }).optional().default([]), // Make it optional and default to empty array
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
    meals: zod_1.z.preprocess((val) => {
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
    }, zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.preprocess((val) => (val === '' ? undefined : Number(val)), zod_1.z.number().min(0, "Price cannot be negative"))
    })).default([])),
    extraBaggage: zod_1.z.preprocess((val) => {
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
        return [val];
    }, zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.preprocess((val) => (val === '' ? undefined : Number(val)), zod_1.z.number().min(0, "Price cannot be negative"))
    })).default([])),
    airportTransfer: zod_1.z.preprocess((val) => {
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
        return [val];
    }, zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.preprocess((val) => (val === '' ? undefined : Number(val)), zod_1.z.number().min(0, "Price cannot be negative"))
    })).default([])),
    unlimitedInternet: zod_1.z.preprocess((val) => {
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
        return [val];
    }, zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.preprocess((val) => (val === '' ? undefined : Number(val)), zod_1.z.number().min(0, "Price cannot be negative"))
    })).default([])),
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
    .transform(data => (Object.assign(Object.assign({}, data), { 
    // Ensure arrays are always arrays
    meals: Array.isArray(data.meals) ? data.meals : [], extraBaggage: Array.isArray(data.extraBaggage) ? data.extraBaggage : [], airportTransfer: Array.isArray(data.airportTransfer) ? data.airportTransfer : [], unlimitedInternet: Array.isArray(data.unlimitedInternet) ? data.unlimitedInternet : [] })));
