"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAirLineImageSchema = void 0;
const zod_1 = require("zod");
exports.AddAirLineImageSchema = zod_1.z.object({
    airLineId: zod_1.z.string().uuid(),
    path: zod_1.z.string().min(1),
});
