"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterRoomSchema = void 0;
const zod_1 = require("zod");
exports.FilterRoomSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid().optional(),
    hotelId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.enum(["all", "active", "not_active"]).optional(),
    name: zod_1.z.string().optional(),
    page: zod_1.z.string().transform(Number).optional(),
    limit: zod_1.z.string().transform(Number).optional(),
});
