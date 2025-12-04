"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryFilterSchema = exports._periods = void 0;
const zod_1 = require("zod");
exports._periods = [
    "current_week",
    "current_month",
    "past_month",
    "current_year",
    "past_year",
];
const periodSet = new Set(exports._periods);
exports.SummaryFilterSchema = zod_1.z.object({
    period: zod_1.z.preprocess((val) => {
        if (typeof val === "string" && periodSet.has(val)) {
            return val;
        }
        return "current_month";
    }, zod_1.z.enum(exports._periods)),
});
