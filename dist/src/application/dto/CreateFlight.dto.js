"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFlightSchema = void 0;
const zod_1 = require("zod");
exports.CreateFlightSchema = zod_1.z.object({
    // المعلومات الأساسية
    status: zod_1.z.boolean().default(true),
    airlineId: zod_1.z.string().uuid({ message: "معرف شركة الطيران غير صالح" }),
    clientId: zod_1.z.string().uuid({ message: "معرف العميل غير صالح" }),
    name: zod_1.z.string().min(1, { message: "اسم الرحلة مطلوب" }),
    // التقييم اختياري وديفولت = 0
    rating: zod_1.z.coerce.number().optional().default(0),
    // معلومات الرحلة
    departureCity: zod_1.z.string().min(1, { message: "مدينة المغادرة مطلوبة" }),
    arrivalCity: zod_1.z.string().min(1, { message: "مدينة الوصول مطلوبة" }),
    flightNumber: zod_1.z.string().min(1, { message: "رقم الرحلة مطلوب" }),
    // توقيت الرحلة
    flightDate: zod_1.z
        .string()
        .min(1, { message: "تاريخ الرحلة مطلوب" })
        .refine((s) => !isNaN(Date.parse(s)), { message: "تاريخ الرحلة غير صالح" }),
    returnDate: zod_1.z
        .string()
        .min(1, { message: "تاريخ العودة مطلوب" })
        .refine((s) => !isNaN(Date.parse(s)), { message: "تاريخ العودة غير صالح" }),
    departureTime: zod_1.z.string().min(1, { message: "وقت المغادرة مطلوب" }),
    arrivalTime: zod_1.z.string().min(1, { message: "وقت الوصول مطلوب" }),
    flightDuration: zod_1.z.preprocess((val) => (val === "" ? 0 : Number(val)), zod_1.z.number().min(0, { message: "مدة الرحلة يجب أن تكون رقمًا موجبًا" })),
    // تفاصيل المقاعد والتذاكر
    // availableSeats: z.preprocess(
    //   (val) => (val === "" ? 0 : Number(val)),
    //   z.number().int().min(0, { message: "عدد المقاعد المتاحة يجب أن يكون رقمًا صحيحًا موجبًا" })
    // ),
    numberOfStops: zod_1.z.preprocess((val) => (val === "" ? 0 : Number(val)), zod_1.z.number().int().min(0, { message: "عدد التوقفات يجب أن يكون رقمًا صحيحًا غير سالب" })),
    // فئة الحجز والمرافق
    bookingClass: zod_1.z.string().min(1, { message: "فئة الحجز مطلوبة" }),
    inFlightEntertainment: zod_1.z.string().min(1, { message: "حقل الترفيه على متن الطائرة مطلوب" }),
    usbPortOutlet: zod_1.z.string().min(1, { message: "حقل منافذ USB مطلوب" }),
    // التقييم
    // الأسعار والخصومات
    price: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().min(0, { message: "السعر يجب أن يكون قيمة موجبة" })),
    discount: zod_1.z.preprocess((val) => (val === "" || val === undefined ? 0 : Number(val)), zod_1.z.number().min(0).max(100, { message: "نسبة الخصم يجب أن تكون بين 0 و 100" }).default(0)),
    // معلومات الطائرة
    aircraftType: zod_1.z.string().min(1, { message: "نوع الطائرة مطلوب" }),
    seatLayout: zod_1.z.string().min(1, { message: "تخطيط المقاعد مطلوب" }),
    seatPitch: zod_1.z.string().min(1, { message: "مسافة المقاعد مطلوبة" }),
    gate: zod_1.z.string().min(1, { message: "البوابة مطلوبة" }),
    aircraftImage: zod_1.z.string().url({ message: "صورة الطائرة يجب أن تكون رابطًا صالحًا" }).optional(),
    rest: zod_1.z.preprocess((val) => (val === "" ? null : val), zod_1.z.string().nullable().optional()),
    transit: zod_1.z.preprocess((val) => {
        if (typeof val === "string") {
            return val.toLowerCase() === "true";
        }
        return Boolean(val);
    }, zod_1.z.boolean()),
    // معلومات إضافية
    currency: zod_1.z.string().default('AED'),
    departureIata: zod_1.z.string().min(1, { message: "كود IATA للمغادرة مطلوب" }),
    arrivalIata: zod_1.z.string().min(1, { message: "كود IATA للوصول مطلوب" }),
    isSuggested: zod_1.z.boolean().default(false),
    // القوائم والمرافق
    baggage: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.string()).default([])),
    ratings: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.string()).default([])),
    // New service fields
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
    unlimitedInternet: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.number().min(0, "Price cannot be negative")
    })).default([]).optional()),
    airportTransfer: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.number().min(0, "Price cannot be negative")
    })).default([]).optional()),
    extraBaggage: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
        totalPrice: zod_1.z.number().min(0, "Price cannot be negative")
    })).default([]).optional()),
    seats: zod_1.z.preprocess((val) => {
        const seats = typeof val === "string" ? JSON.parse(val) : val || [];
        // Auto-generate IDs for seats if not provided
        const generateRandomSeatNumber = () => {
            const row = Math.floor(Math.random() * 30) + 1; // Rows 1-30
            const seatLetter = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // Letters A-F
            return `${row}${seatLetter}`;
        };
        return Array.isArray(seats)
            ? seats.map(seat => (Object.assign(Object.assign({}, seat), { number: generateRandomSeatNumber(), id: Math.random().toString(36).substring(2, 11) // Generate a random ID if not provided
             })))
            : [];
    }, zod_1.z.array(zod_1.z.object({
        number: zod_1.z.string().optional(),
        isBooking: zod_1.z.boolean().optional(),
        id: zod_1.z.string().optional(),
        position: zod_1.z.string().optional()
    })).default([]).optional()),
    amenities: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val || []), zod_1.z.array(zod_1.z.string()).default([])),
    transitFlights: zod_1.z.preprocess((val) => {
        if (!val)
            return {};
        try {
            const parsed = typeof val === 'string' ? JSON.parse(val) : val;
            // If it's an array, convert to object with IDs as keys
            if (Array.isArray(parsed)) {
                return parsed.reduce((acc, flight) => (Object.assign(Object.assign({}, acc), { [flight.id || Math.random().toString(36).substring(2, 11)]: flight })), {});
            }
            return parsed || {};
        }
        catch (_a) {
            return {};
        }
    }, zod_1.z.record(zod_1.z.object({
        id: zod_1.z.string().optional(),
        name: zod_1.z.string().min(1, { message: "اسم الرحلة مطلوب" }).optional(),
        flightNumber: zod_1.z.string().min(1, { message: "رقم الرحلة مطلوب" }).optional(),
        departureCity: zod_1.z.string().min(1, { message: "مدينة المغادرة مطلوبة" }).optional(),
        arrivalCity: zod_1.z.string().min(1, { message: "مدينة الوصول مطلوبة" }).optional(),
        flightDate: zod_1.z.string().min(1, { message: "تاريخ الرحلة مطلوب" }).optional(),
        departureTime: zod_1.z.string().min(1, { message: "وقت المغادرة مطلوب" }).optional(),
        arrivalTime: zod_1.z.string().min(1, { message: "وقت الوصول مطلوب" }).optional(),
        price: zod_1.z.number().min(0, { message: "السعر يجب أن يكون قيمة موجبة" }).optional(),
        airlineId: zod_1.z.string().uuid({ message: "معرف شركة الطيران غير صالح" }).optional(),
        clientId: zod_1.z.string().uuid({ message: "معرف العميل غير صالح" }).optional(),
        seats: zod_1.z.preprocess((val) => {
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
            id: zod_1.z.string().optional(),
            number: zod_1.z.string(),
            isBooking: zod_1.z.boolean().default(false),
            position: zod_1.z.string().optional()
        })).default([])).optional(),
        departureIata: zod_1.z.string().min(1, { message: "كود IATA للمغادرة مطلوب" }).optional(),
        arrivalIata: zod_1.z.string().min(1, { message: "كود IATA للوصول مطلوب" }).optional(),
        flightDuration: zod_1.z.number().min(0, { message: "مدة الرحلة يجب أن تكون رقمًا موجبًا" }).optional(),
        aircraftType: zod_1.z.string().optional(),
        bookingClass: zod_1.z.string().optional(),
        inFlightEntertainment: zod_1.z.string().optional(),
        usbPortOutlet: zod_1.z.string().optional(),
        numberOfStops: zod_1.z.number().int().min(0).optional(),
        status: zod_1.z.boolean().optional(),
        rating: zod_1.z.number().optional(),
        currency: zod_1.z.string().optional()
    })).default({}).optional()),
    returnFlights: zod_1.z.preprocess((val) => {
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
        flightNumber: zod_1.z.string().optional(),
        departureCity: zod_1.z.string().optional(),
        arrivalCity: zod_1.z.string().optional(),
        flightDate: zod_1.z.string().optional(),
        departureTime: zod_1.z.string().optional(),
        arrivalTime: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        airlineId: zod_1.z.string().optional(),
        seats: zod_1.z.preprocess((val) => {
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
            number: zod_1.z.string(),
            isBooking: zod_1.z.boolean(),
            position: zod_1.z.string().optional()
        })).default([])).optional()
    })).default([])),
});
