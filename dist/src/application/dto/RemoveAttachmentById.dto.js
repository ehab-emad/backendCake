"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveAttachmentByIdSchema = void 0;
const zod_1 = require("zod");
exports.RemoveAttachmentByIdSchema = zod_1.z.object({
    attachmentId: zod_1.z.string().uuid(),
});
