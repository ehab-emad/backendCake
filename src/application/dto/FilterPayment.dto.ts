import { z } from "zod";

export const FilterPaymentSchema = z.object({
  clientId: z.string().uuid().optional(),
  reservationId: z.string().uuid().optional(),
  status: z.enum(["paid", "under_review", "cancelled"]).optional(),

  minAmount: z.preprocess((val) => {
    if (typeof val === "string") return Number(val);
    if (typeof val === "number") return val;
    return undefined;
  }, z.number().nonnegative().optional()),
  maxAmount: z.preprocess((val) => {
    if (typeof val === "string") return Number(val);
    if (typeof val === "number") return val;
    return undefined;
  }, z.number().nonnegative().optional()),

  fromDate: z.preprocess((val) => {
    if (typeof val === "string") return new Date(val);
    if (val instanceof Date) return val;
    return undefined;
  }, z.date().optional()),
  toDate: z.preprocess((val) => {
    if (typeof val === "string") return new Date(val);
    if (val instanceof Date) return val;
    return undefined;
  }, z.date().optional()),

  page: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    if (typeof val === "number") return val;
    return undefined;
  }, z.number().int().positive().default(1)),
  limit: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    if (typeof val === "number") return val;
    return undefined;
  }, z.number().int().positive().default(20)),
});

export type FilterPaymentDTO = z.infer<typeof FilterPaymentSchema>;
