import { z } from "zod";

export const FilterReservationSchema = z.object({
  clientId: z.string().uuid({
    message: "يجب أن يكون معرف العميل صالحًا"
  }).optional(),
  customerId: z.string().uuid({
    message: "يجب أن يكون معرف العميل صالحًا"
  }).optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
    errorMap: () => ({ message: "حالة الحجز يجب أن تكون: pending, confirmed, cancelled, أو completed" })
  }).optional(),
  serviceType: z.enum(["room", "flight", "trip"], {
    errorMap: () => ({ message: "نوع الخدمة يجب أن تكون: room, flight, أو trip" })
  }).optional(),
  category: z.string({
    invalid_type_error: "يجب أن يكون التصنيف نصيًا"
  }).optional(),
  fromDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "fromDate must be YYYY-MM-DD")
    .transform((s) => new Date(s))
    .optional(),
  toDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "toDate must be YYYY-MM-DD")
    .transform((s) => new Date(s))
    .optional(),
  departureDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "departureDate must be YYYY-MM-DD")
    .transform((s) => new Date(s))
    .optional(),
  returnDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "returnDate must be YYYY-MM-DD")
    .transform((s) => new Date(s))
    .optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  customerType: z.enum(["VIP", "Regular"]).optional(),
});

export type FilterReservationDTO = z.infer<typeof FilterReservationSchema>;
