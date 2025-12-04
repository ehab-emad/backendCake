import { z } from "zod";

const UpdateFlightPayload = z
  .object({
    // المعلومات الأساسية
    status: z.boolean().default(true).optional(),
    airlineId: z.string().uuid({ message: "معرف شركة الطيران غير صالح" }).optional(),
    clientId: z.string().uuid({ message: "معرف العميل غير صالح" }).optional(),
    name: z.string().min(1, { message: "اسم الرحلة مطلوب" }).optional(),
    // التقييم اختياري وديفولت = 0
    rating: z.coerce.number().optional().default(0),
    // معلومات الرحلة
    departureCity: z.string().min(1, { message: "مدينة المغادرة مطلوبة" }).optional(),
    arrivalCity: z.string().min(1, { message: "مدينة الوصول مطلوبة" }).optional(),
    flightNumber: z.string().min(1, { message: "رقم الرحلة مطلوب" }).optional(),

    // توقيت الرحلة
    flightDate: z
      .string()
      .min(1, { message: "تاريخ الرحلة مطلوب" })
      .refine((s) => !isNaN(Date.parse(s)), { message: "تاريخ الرحلة غير صالح" })
      .optional(),

    returnDate: z
      .string()
      .min(1, { message: "تاريخ العودة مطلوب" })
      .refine((s) => !isNaN(Date.parse(s)), { message: "تاريخ العودة غير صالح" })
      .optional(),

    departureTime: z.string().min(1, { message: "وقت المغادرة مطلوب" }).optional(),
    arrivalTime: z.string().min(1, { message: "وقت الوصول مطلوب" }).optional(),
    flightDuration: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0, { message: "مدة الرحلة يجب أن تكون رقمًا موجبًا" }).optional()
    ),

    // تفاصيل المقاعد والتذاكر
    // availableSeats: z.preprocess(
    //   (val) => (val === "" ? undefined : Number(val)),
    //   z.number().int().min(0, { message: "عدد المقاعد المتاحة يجب أن يكون رقمًا صحيحًا موجبًا" }).optional()
    // ),

    numberOfStops: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().int().min(0, { message: "عدد التوقفات يجب أن يكون رقمًا صحيحًا غير سالب" }).optional()
    ),

    // فئة الحجز والمرافق
    bookingClass: z.string().min(1, { message: "فئة الحجز مطلوبة" }).optional(),
    inFlightEntertainment: z.string().min(1, { message: "حقل الترفيه على متن الطائرة مطلوب" }).optional(),
    usbPortOutlet: z.string().min(1, { message: "حقل منافذ USB مطلوب" }).optional(),
   
  rest: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional()
  ),
  transit: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val.toLowerCase() === "true";
      }
      return Boolean(val);
    },
    z.boolean()
  ),
    

    // الأسعار والخصومات
    price: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0, { message: "السعر يجب أن يكون قيمة موجبة" }).optional()
    ),

    discount: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0).max(100, { message: "نسبة الخصم يجب أن تكون بين 0 و 100" }).optional()
    ),

    // معلومات الطائرة
    aircraftType: z.string().min(1, { message: "نوع الطائرة مطلوب" }).optional(),
    seatLayout: z.string().min(1, { message: "تخطيط المقاعد مطلوب" }).optional(),
    seatPitch: z.string().min(1, { message: "مسافة المقاعد مطلوبة" }).optional(),
    gate: z.string().min(1, { message: "البوابة مطلوبة" }).optional(),
    aircraftImage: z.string().url({ message: "صورة الطائرة يجب أن تكون رابطًا صالحًا" }).optional(),

    // معلومات إضافية
    currency: z.string().default('AED').optional(),
    departureIata: z.string().min(1, { message: "كود IATA للمغادرة مطلوب" }).optional(),
    arrivalIata: z.string().min(1, { message: "كود IATA للوصول مطلوب" }).optional(),
    isSuggested: z.boolean().default(false).optional(),

    // القوائم والمرافق
    newBaggage: z.preprocess(
      (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
      z.array(z.string()).default([]).optional()
    ),
    newAmenities: z.preprocess(
      (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
      z.array(z.string()).default([]).optional()
    ),
    
    // JSON fields with proper validation
    meals: z.preprocess(
      (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch {
            return [];
          }
        }
        return [val]; // Handle single object case
      },
      z.array(z.object({
        name: z.string().optional(),
        totalPrice: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().min(0, "Price cannot be negative")
        )
      })).default([]).optional()
    ),
    
    unlimitedInternet: z.preprocess(
      (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
      z.array(z.object({
        name: z.string().min(1, "Name is required"),
        totalPrice: z.number().min(0, "Price cannot be negative")
      })).default([]).optional()
    ),
    
    airportTransfer: z.preprocess(
      (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
      z.array(z.object({
        name: z.string().min(1, "Name is required"),
        totalPrice: z.number().min(0, "Price cannot be negative")
      })).default([]).optional()
    ),
    
    extraBaggage: z.preprocess(
      (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
      z.array(z.object({
        name: z.string().min(1, "Name is required"),
        totalPrice: z.number().min(0, "Price cannot be negative")
      })).default([]).optional()
    ),
    seats: z.preprocess(
      (val) => {
        const seats = typeof val === "string" ? JSON.parse(val) : val || [];
        // Auto-generate IDs for new seats if not provided
        const generateRandomSeatNumber = () => {
          const row = Math.floor(Math.random() * 30) + 1; // Rows 1-30
          const seatLetter = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // Letters A-F
          return `${row}${seatLetter}`;
        };
        return Array.isArray(seats) 
          ? seats.map(seat => ({
              ...seat,
              number:  generateRandomSeatNumber(),
              id: seat.id || Math.random().toString(36).substring(2, 11) // Generate a random ID if not provided
            }))
          : [];
      },
      z.array(z.object({
        number: z.string().optional(),
        isBooking: z.boolean().optional(),
        id: z.string().optional(),
        position: z.string().optional()
      })).default([]).optional()
    ),
    newRatings: z.preprocess(
      (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
      z.array(z.string()).default([]).optional()
    ),
    
    newMeals: z.preprocess(
      (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
      z.array(z.string()).default([]).optional()
    ),

    transitFlights: z.preprocess(
      (val) => {
        if (!val) return {};
        try {
          const parsed = typeof val === 'string' ? JSON.parse(val) : val;
          // If it's an array, convert to object with IDs as keys
          if (Array.isArray(parsed)) {
            return parsed.reduce((acc: Record<string, any>, flight) => ({
              ...acc,
              [flight.id || Math.random().toString(36).substring(2, 11)]: flight
            }), {});
          }
          return parsed || {};
        } catch {
          return {};
        }
      },
      z.record(z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: "اسم الرحلة مطلوب" }).optional(),
        flightNumber: z.string().min(1, { message: "رقم الرحلة مطلوب" }).optional(),
        departureCity: z.string().min(1, { message: "مدينة المغادرة مطلوبة" }).optional(),
        arrivalCity: z.string().min(1, { message: "مدينة الوصول مطلوبة" }).optional(),
        flightDate: z.string().min(1, { message: "تاريخ الرحلة مطلوب" }).optional(),
        departureTime: z.string().min(1, { message: "وقت المغادرة مطلوب" }).optional(),
        arrivalTime: z.string().min(1, { message: "وقت الوصول مطلوب" }).optional(),
        price: z.number().min(0, { message: "السعر يجب أن يكون قيمة موجبة" }).optional(),
        airlineId: z.string().uuid({ message: "معرف شركة الطيران غير صالح" }).optional(),
        clientId: z.string().uuid({ message: "معرف العميل غير صالح" }).optional(),
        seats: z.preprocess(
          (val) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') {
              try {
                return JSON.parse(val);
              } catch {
                return [];
              }
            }
            return [val];
          },
          z.array(z.object({
            id: z.string().optional(),
            number: z.string(),
            isBooking: z.boolean().default(false),
            position: z.string().optional()
          })).default([])
        ).optional(),
        departureIata: z.string().min(1, { message: "كود IATA للمغادرة مطلوب" }).optional(),
        arrivalIata: z.string().min(1, { message: "كود IATA للوصول مطلوب" }).optional(),
        flightDuration: z.number().min(0, { message: "مدة الرحلة يجب أن تكون رقمًا موجبًا" }).optional(),
        aircraftType: z.string().optional(),
        bookingClass: z.string().optional(),
        inFlightEntertainment: z.string().optional(),
        usbPortOutlet: z.string().optional(),
        numberOfStops: z.number().int().min(0).optional(),
        status: z.boolean().optional(),
        rating: z.number().optional(),
        currency: z.string().optional()
      })).default({}).optional()
    ),
    returnFlights: z.preprocess(
      (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch {
            return [];
          }
        }
        return [val];
      },
      z.array(z.object({
        name: z.string().optional(),
        flightNumber: z.string().optional(),
        departureCity: z.string().optional(),
        arrivalCity: z.string().optional(),
        flightDate: z.string().optional(),
        departureTime: z.string().optional(),
        arrivalTime: z.string().optional(),
        price: z.number().optional(),
        airlineId: z.string().optional(),
        seats: z.preprocess(
          (val) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') {
              try {
                return JSON.parse(val);
              } catch {
                return [];
              }
            }
            return [val];
          },
          z.array(z.object({
            number: z.string(),
            isBooking: z.boolean(),
            position: z.string().optional()
          })).default([])
        ).optional()
      })).default([]).optional()
    ),
   
  })
  .partial();

export const UpdateFlightSchema = UpdateFlightPayload;

export type UpdateFlightDTO = z.infer<typeof UpdateFlightPayload>;
