"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterProductSchema = void 0;
const zod_1 = require("zod");
const parseOptionalNumber = (val) => {
    if (val === null || val === undefined || val === '') {
        return undefined;
    }
    const num = Number(val);
    return isNaN(num) ? undefined : num;
};
exports.FilterProductSchema = zod_1.z.object({
    page: zod_1.z.preprocess(parseOptionalNumber, zod_1.z.number().int().positive().optional().default(1)),
    limit: zod_1.z.preprocess(parseOptionalNumber, zod_1.z.number().int().positive().optional().default(10)),
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    minPrice: zod_1.z.preprocess(parseOptionalNumber, zod_1.z.number().positive().optional()),
    maxPrice: zod_1.z.preprocess(parseOptionalNumber, zod_1.z.number().positive().optional()),
    status: zod_1.z.string().optional(),
    minRating: zod_1.z.preprocess(parseOptionalNumber, zod_1.z.number().min(0).max(5).optional()),
    maxRating: zod_1.z.preprocess(parseOptionalNumber, zod_1.z.number().min(0).max(5).optional()),
    material: zod_1.z.string().optional(),
    beads: zod_1.z.string().optional(),
    length: zod_1.z.string().optional(),
    weight: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(), // General search term
});
