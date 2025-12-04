import { z } from "zod";

export const FilterHotelSchema = z.object({
  // Basic filters
  clientId: z.string().uuid({
    message: "يجب أن يكون معرف العميل صالحًا"
  }).optional(),
  
  status: z.enum(["all", "active", "not_active"], {
    errorMap: () => ({ message: "حالة الفندق يجب أن تكون: all, active, أو not_active" })
  }).default("all"),
  
  // Search by name, location, or city
  name: z.string({
    invalid_type_error: "يجب أن يكون نص البحث نصيًا"
  }).optional(),
  
  location: z.string({
    invalid_type_error: "يجب أن يكون الموقع نصيًا"
  }).optional(),
  
  city: z.string({
    invalid_type_error: "يجب أن تكون المدينة نصية"
  }).optional(),
  
  // Rating filters
  minRating: z.coerce.number({
    invalid_type_error: "يجب أن يكون الحد الأدنى للتقييم رقمًا"
  })
  .min(0, { message: "لا يمكن أن يقل التقييم عن 0" })
  .max(5, { message: "لا يمكن أن يزيد التقييم عن 5" })
  .optional(),
  
  maxRating: z.coerce.number({
    invalid_type_error: "يجب أن يكون الحد الأقصى للتقييم رقمًا"
  })
  .min(0, { message: "لا يمكن أن يقل التقييم عن 0" })
  .max(5, { message: "لا يمكن أن يزيد التقييم عن 5" })
  .optional(),
  
  // Price filters
  minPrice: z.coerce.number({
    invalid_type_error: "يجب أن يكون الحد الأدنى للسعر رقمًا"
  })
  .min(0, { message: "لا يمكن أن يقل السعر عن 0" })
  .optional(),
  
  maxPrice: z.coerce.number({
    invalid_type_error: "يجب أن يكون الحد الأقصى للسعر رقمًا"
  })
  .min(0, { message: "لا يمكن أن يقل السعر عن 0" })
  .optional(),
  
  // Amenities filter (comma-separated list)
  amenities: z.string().optional(),
  
  // Room type filter (comma-separated list)
  roomTypes: z.string().optional(),
  
  // Pagination
  page: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number({
      invalid_type_error: "يجب أن يكون رقم الصفحة رقمًا صحيحًا"
    })
    .int({ message: "يجب أن يكون رقم الصفحة رقمًا صحيحًا" })
    .min(1, { message: "لا يمكن أن يقل رقم الصفحة عن 1" })
    .default(1)
  ),
  
  limit: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number({
      invalid_type_error: "يجب أن يكون الحد الأقصى للعناصر رقمًا صحيحًا"
    })
    .int({ message: "يجب أن يكون الحد الأقصى للعناصر رقمًا صحيحًا" })
    .min(1, { message: "لا يمكن أن يقل الحد الأقصى للعناصر عن 1" })
    .max(100, { message: "لا يمكن أن يزيد الحد الأقصى للعناصر عن 100" })
    .default(20)
  ),
  
  // Sorting
  sortBy: z.enum(['price', 'rating', 'name'], {
    errorMap: () => ({ message: "حقل الترتيب يجب أن يكون: price, rating, أو name" })
  }).optional(),
  
  sortOrder: z.enum(['asc', 'desc'], {
    errorMap: () => ({ message: "اتجاه الترتيب يجب أن يكون: asc أو desc" })
  }).default('asc'),
  
}).refine(
  (data) => !(data.minPrice !== undefined && data.maxPrice !== undefined) || (data.maxPrice >= data.minPrice),
  {
    message: "يجب أن يكون الحد الأقصى للسعر أكبر من أو يساوي الحد الأدنى",
    path: ["maxPrice"]
  }
).refine(
  (data) => !(data.minRating !== undefined && data.maxRating !== undefined) || (data.maxRating >= data.minRating),
  {
    message: "يجب أن يكون الحد الأقصى للتقييم أكبر من أو يساوي الحد الأدنى",
    path: ["maxRating"]
  }
);

export type FilterHotelDTO = z.infer<typeof FilterHotelSchema>;
