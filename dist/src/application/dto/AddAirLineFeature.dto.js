"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAirLineFeatureSchema = void 0;
const zod_1 = require("zod");
exports.AddAirLineFeatureSchema = zod_1.z.object({
    airLineId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
});
