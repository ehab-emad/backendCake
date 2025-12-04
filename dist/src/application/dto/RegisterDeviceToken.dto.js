"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDeviceTokenSchema = void 0;
const zod_1 = require("zod");
exports.RegisterDeviceTokenSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
});
