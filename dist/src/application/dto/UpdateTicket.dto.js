"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTicketSchema = void 0;
const zod_1 = require("zod");
exports.UpdateTicketSchema = zod_1.z
    .object({
    title: zod_1.z.string().min(1).optional(),
    status: zod_1.z.enum(["open", "pending", "closed"]).optional(),
    clientId: zod_1.z.string().uuid().optional(),
    userId: zod_1.z.string().uuid().optional(),
    message: zod_1.z.string().min(1).optional(),
    newAttachments: zod_1.z.array(zod_1.z.string()).optional(),
})
    .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field must be provided",
})
    .refine((data) => {
    if (data.message !== undefined) {
        return ((data.clientId !== undefined && !data.userId) ||
            (!data.clientId && data.userId !== undefined));
    }
    return true;
}, {
    message: "When sending a message, you must provide exactly one of clientId or userId.",
    path: ["clientId", "userId", "message"],
});
