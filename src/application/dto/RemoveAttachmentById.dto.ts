import { z } from "zod";

export const RemoveAttachmentByIdSchema = z.object({
  attachmentId: z.string().uuid(),
});

export type RemoveAttachmentByIdDTO = z.infer<
  typeof RemoveAttachmentByIdSchema
>;
