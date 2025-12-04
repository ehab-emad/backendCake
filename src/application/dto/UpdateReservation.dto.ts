import { z } from "zod";

export const UpdateReservationSchema = z
  .object({
    reservationNumber: z.string().optional(),
    status: z
      .enum(["pending", "confirmed", "cancelled", "completed"])
      .optional(),
    clientId: z.string().uuid().optional(),
    customerId: z.string().uuid().optional(),
    serviceType: z.enum(["room", "flight", "trip"]).optional(),
    serviceId: z.string().uuid().optional(),

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
    infant: z.number().int().nonnegative().optional(),
    rooms: z.number().int().positive().optional(),
    price: z.number().nonnegative().optional(),
    seat: z.preprocess(
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
      z.array(z.string()).default([]),
    ),

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
    transitFlightSeats: z.preprocess(
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
    returnFlightSeats: z.preprocess(
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
      (val) => (typeof val === 'string' ? JSON.parse(val) : val || []),
      z.array(z.object({
        name: z.string().optional(),
        totalPrice: z.number().min(0, "Price cannot be negative")
      })).default([]).optional()
    ),
    
    extraBaggage: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val || []),
      z.array(z.object({
        name: z.string().optional(),
        totalPrice: z.number().min(0, "Price cannot be negative")
      })).default([]).optional()
    ),
    
    airportTransfer: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val || []),
      z.array(z.object({
        name: z.string().optional(),
        totalPrice: z.number().min(0, "Price cannot be negative")
      })).default([]).optional()
    ),
    
    unlimitedInternet: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val || []),
      z.array(z.object({
        name: z.string().optional(),
        totalPrice: z.number().min(0, "Price cannot be negative")
      })).default([]).optional()
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
  .refine(
    (data) => {
      if (data.serviceType === "room") {
        return data.fromDate !== undefined && data.toDate !== undefined;
      }
      if (data.serviceType === "flight") {
        return (
          data.adult !== undefined &&
          data.children !== undefined &&
          data.seat !== undefined &&
          data.baggage !== undefined &&
          data.meals !== undefined &&
          data.extraBaggage !== undefined &&
          data.airportTransfer !== undefined &&
          data.unlimitedInternet !== undefined
        );
      }
      return Object.keys(data).length > 0;
    },
    {
      message:
        "— switching to room needs fromDate & toDate; — switching to flight needs adult, children, seat, baggage, meals, extraBaggage, airportTransfer & unlimitedInternet",
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
    }
  )
  .refine(
    (data) => {
      if (data.passportExpiry) {
        const expiryDate = new Date(data.passportExpiry);
        const today = new Date();
        return expiryDate > today;
      }
      return true;
    },
    {
      message: "Passport must not be expired",
      path: ["passportExpiry"],
    }
  )
  .refine(
    (data) => {
      if (data.dateOfBirth) {
        const birthDate = new Date(data.dateOfBirth);
        const today = new Date();
        return birthDate < today;
      }
      return true;
    },
    {
      message: "Date of birth must be in the past",
      path: ["dateOfBirth"],
    }
  );

export type UpdateReservationDTO = z.infer<typeof UpdateReservationSchema>;
