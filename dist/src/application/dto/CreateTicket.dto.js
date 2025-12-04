"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTicketSchema = void 0;
const zod_1 = require("zod");
exports.CreateTicketSchema = zod_1.z
    .object({
    clientId: zod_1.z.string().uuid().optional(),
    userId: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().min(1),
    status: zod_1.z.enum(["open", "pending", "closed"]).default("open"),
    message: zod_1.z.string().min(1),
    attachments: zod_1.z.array(zod_1.z.string()).optional(),
})
    .refine((data) => (data.clientId && !data.userId) || (!data.clientId && data.userId), {
    message: "You must provide exactly one of clientId or userId (not both).",
    path: ["clientId", "userId"],
});
