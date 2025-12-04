import { z } from "zod";

export const CreateReservationSchema = z
  .object({
    clientId: z.string().uuid(),
    customerId: z.string().uuid(),
    serviceType: z.enum(["room", "flight", "trip"]),
    serviceId: z.string().uuid(),

    fromDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "fromDate must be YYYY-MM-DD")
      .optional(),
    toDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "toDate must be YYYY-MM-DD")
      .optional(),

    adult: z.number().int().nonnegative().optional(),
    children: z.number().int().nonnegative().optional(),
    infant: z.number().int().nonnegative().default(0).optional(),
    rooms: z.number().int().positive().default(1).optional(),
    price: z.number().nonnegative().default(0).optional(),
    seat: z.custom<string | string[] | undefined | null>(
      (val) => {
        // If value is not provided, it's valid (optional)
        if (val === undefined || val === null) return true;
        // If it's an array, it's valid if empty or contains valid strings
        if (Array.isArray(val)) return true;
        // If it's a string, it's valid (even empty)
        if (typeof val === 'string') return true;
        return false;
      },
      { message: 'Seat must be a string or array of strings' }
    ).transform((val) => {
      if (!val) return []; // Handle null/undefined
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    }).optional().default([]), // Make it optional and default to empty array

    // كراسي الرحلة الأساسية
    mainFlightSeats: z.preprocess(
      (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch {
            return [val]; // Return as single item array if not valid JSON
          }
        }
        return [];
      },
      z.array(z.string()).default([]).optional()
    ),

    // كراسي الرحلات الترانزيت
   // كراسي الرحلات الترانزيت
transitFlightSeats:z.preprocess(
  (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return [val]; // Return as single item array if not valid JSON
      }
    }
    return [];
  },
  z.array(z.string()).default([]).optional()
),

    // كراسي رحلات العودة
    returnFlightSeats:z.preprocess(
      (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch {
            return [val]; // Return as single item array if not valid JSON
          }
        }
        return [];
      },
      z.array(z.string()).default([]).optional()
    ),
   

    baggage: z.string().optional(),
    
    // Service items - handle both stringified JSON and direct objects
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
    
    extraBaggage: z.preprocess(
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
        totalPrice: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().min(0, "Price cannot be negative")
        )
      })).default([])
    ),
    
    airportTransfer: z.preprocess(
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
        totalPrice: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().min(0, "Price cannot be negative")
        )
      })).default([])
    ),
    
    unlimitedInternet: z.preprocess(
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
        totalPrice: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().min(0, "Price cannot be negative")
        )
      })).default([])
    ),
    
    extras: z.string().optional(),
    
    // New customer details fields
    name: z.string().min(2).max(255).optional().nullable(),
    email: z.string().email().optional().nullable(),
    gender: z.enum(['male', 'female', 'other']).optional().nullable(),
    latitude: z.number().min(-90).max(90).optional().nullable(),
    longitude: z.number().min(-180).max(180).optional().nullable(),
    nationality: z.string().max(100).optional().nullable(),
    passportNumber: z.string().max(50).optional().nullable(),
    passportExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'passportExpiry must be YYYY-MM-DD').optional().nullable(),
    phoneNumber: z.string().max(20).optional().nullable(),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dateOfBirth must be YYYY-MM-DD').optional().nullable(),
    departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'departureDate must be YYYY-MM-DD').optional().nullable(),
    returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'returnDate must be YYYY-MM-DD').optional().nullable(),
  })
  .transform(data => ({
    ...data,
    // Ensure arrays are always arrays
    meals: Array.isArray(data.meals) ? data.meals : [],
    extraBaggage: Array.isArray(data.extraBaggage) ? data.extraBaggage : [],
    airportTransfer: Array.isArray(data.airportTransfer) ? data.airportTransfer : [],
    unlimitedInternet: Array.isArray(data.unlimitedInternet) ? data.unlimitedInternet : []
    // transitFlightSeats: typeof data.transitFlightSeats === 'object' && data.transitFlightSeats !== null ? data.transitFlightSeats : {},
  }))
  // All fields are optional with no conditional validation
  ;

export type CreateReservationDTO = z.infer<typeof CreateReservationSchema>;
