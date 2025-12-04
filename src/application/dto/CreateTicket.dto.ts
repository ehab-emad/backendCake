import { z } from "zod";

export const CreateTicketSchema = z
  .object({
    clientId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    title: z.string().min(1),
    status: z.enum(["open", "pending", "closed"]).default("open"),
    message: z.string().min(1),
    attachments: z.array(z.string()).optional(),
  })
  .refine(
    (data) =>
      (data.clientId && !data.userId) || (!data.clientId && data.userId),
    {
      message: "You must provide exactly one of clientId or userId (not both).",
      path: ["clientId", "userId"],
    }
  );

export type CreateTicketDTO = z.infer<typeof CreateTicketSchema>;
