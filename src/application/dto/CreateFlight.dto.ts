import { z } from "zod";

export const CreateFlightSchema = z.object({
  // المعلومات الأساسية
  status: z.boolean().default(true),
  airlineId: z.string().uuid({ message: "معرف شركة الطيران غير صالح" }),
  clientId: z.string().uuid({ message: "معرف العميل غير صالح" }),
  name: z.string().min(1, { message: "اسم الرحلة مطلوب" }),
  // التقييم اختياري وديفولت = 0
  rating: z.coerce.number().optional().default(0),
  
  // معلومات الرحلة
  departureCity: z.string().min(1, { message: "مدينة المغادرة مطلوبة" }),
  arrivalCity: z.string().min(1, { message: "مدينة الوصول مطلوبة" }),
  flightNumber: z.string().min(1, { message: "رقم الرحلة مطلوب" }),

  // توقيت الرحلة
  flightDate: z
    .string()
    .min(1, { message: "تاريخ الرحلة مطلوب" })
    .refine((s) => !isNaN(Date.parse(s)), { message: "تاريخ الرحلة غير صالح" }),

  returnDate: z
    .string()
    .min(1, { message: "تاريخ العودة مطلوب" })
    .refine((s) => !isNaN(Date.parse(s)), { message: "تاريخ العودة غير صالح" }),

  departureTime: z.string().min(1, { message: "وقت المغادرة مطلوب" }),
  arrivalTime: z.string().min(1, { message: "وقت الوصول مطلوب" }),
  flightDuration: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number().min(0, { message: "مدة الرحلة يجب أن تكون رقمًا موجبًا" })
  ),

  // تفاصيل المقاعد والتذاكر
  // availableSeats: z.preprocess(
  //   (val) => (val === "" ? 0 : Number(val)),
  //   z.number().int().min(0, { message: "عدد المقاعد المتاحة يجب أن يكون رقمًا صحيحًا موجبًا" })
  // ),

  numberOfStops: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number().int().min(0, { message: "عدد التوقفات يجب أن يكون رقمًا صحيحًا غير سالب" })
  ),

  // فئة الحجز والمرافق
  bookingClass: z.string().min(1, { message: "فئة الحجز مطلوبة" }),
  inFlightEntertainment: z.string().min(1, { message: "حقل الترفيه على متن الطائرة مطلوب" }),
  usbPortOutlet: z.string().min(1, { message: "حقل منافذ USB مطلوب" }),

  

  // التقييم

  // الأسعار والخصومات
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "السعر يجب أن يكون قيمة موجبة" })
  ),

  discount: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(0).max(100, { message: "نسبة الخصم يجب أن تكون بين 0 و 100" }).default(0)
  ),

  // معلومات الطائرة
  aircraftType: z.string().min(1, { message: "نوع الطائرة مطلوب" }),
  seatLayout: z.string().min(1, { message: "تخطيط المقاعد مطلوب" }),
  seatPitch: z.string().min(1, { message: "مسافة المقاعد مطلوبة" }),
  gate: z.string().min(1, { message: "البوابة مطلوبة" }),
  aircraftImage: z.string().url({ message: "صورة الطائرة يجب أن تكون رابطًا صالحًا" }).optional(),
  
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
  // معلومات إضافية
  currency: z.string().default('AED'),
  departureIata: z.string().min(1, { message: "كود IATA للمغادرة مطلوب" }),
  arrivalIata: z.string().min(1, { message: "كود IATA للوصول مطلوب" }),
  isSuggested: z.boolean().default(false),

  // القوائم والمرافق
  baggage: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
    z.array(z.string()).default([])
  ),
  ratings: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
    z.array(z.string()).default([])
  ),
  
  // New service fields
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
    })).default([])
  ),
  
  unlimitedInternet: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
    z.array(z.object({
      name: z.string().optional(),
      totalPrice: z.number().min(0, "Price cannot be negative")
    })).default([]).optional()
  ),


  airportTransfer: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
    z.array(z.object({
      name: z.string().optional(),
      totalPrice: z.number().min(0, "Price cannot be negative")
    })).default([]).optional()
  ),
  
  extraBaggage: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
    z.array(z.object({
      name: z.string().optional(),
      totalPrice: z.number().min(0, "Price cannot be negative")
    })).default([]).optional()
  ),
  seats: z.preprocess(
    (val) => {
      const seats = typeof val === "string" ? JSON.parse(val) : val || [];
      // Auto-generate IDs for seats if not provided
      const generateRandomSeatNumber = () => {
        const row = Math.floor(Math.random() * 30) + 1; // Rows 1-30
        const seatLetter = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // Letters A-F
        return `${row}${seatLetter}`;
      };
      return Array.isArray(seats) 
        ? seats.map(seat => ({
            ...seat,
            number:  generateRandomSeatNumber(),
            id:Math.random().toString(36).substring(2, 11) // Generate a random ID if not provided
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
  
  amenities: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val || []),
    z.array(z.string()).default([])
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
      })).default([])
    ),

 
});

export type CreateFlightDTO = z.infer<typeof CreateFlightSchema>;
