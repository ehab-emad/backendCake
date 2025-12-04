"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterPaymentSchema = void 0;
const zod_1 = require("zod");
exports.FilterPaymentSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid().optional(),
    reservationId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.enum(["paid", "under_review", "cancelled"]).optional(),
    minAmount: zod_1.z.preprocess((val) => {
        if (typeof val === "string")
            return Number(val);
        if (typeof val === "number")
            return val;
        return undefined;
    }, zod_1.z.number().nonnegative().optional()),
    maxAmount: zod_1.z.preprocess((val) => {
        if (typeof val === "string")
            return Number(val);
        if (typeof val === "number")
            return val;
        return undefined;
    }, zod_1.z.number().nonnegative().optional()),
    fromDate: zod_1.z.preprocess((val) => {
        if (typeof val === "string")
            return new Date(val);
        if (val instanceof Date)
            return val;
        return undefined;
    }, zod_1.z.date().optional()),
    toDate: zod_1.z.preprocess((val) => {
        if (typeof val === "string")
            return new Date(val);
        if (val instanceof Date)
            return val;
        return undefined;
    }, zod_1.z.date().optional()),
    page: zod_1.z.preprocess((val) => {
        if (typeof val === "string")
            return parseInt(val, 10);
        if (typeof val === "number")
            return val;
        return undefined;
    }, zod_1.z.number().int().positive().default(1)),
    limit: zod_1.z.preprocess((val) => {
        if (typeof val === "string")
            return parseInt(val, 10);
        if (typeof val === "number")
            return val;
        return undefined;
    }, zod_1.z.number().int().positive().default(20)),
});
