import { z } from "zod";

export const UpdateTicketSchema = z
  .object({
    title: z.string().min(1).optional(),
    status: z.enum(["open", "pending", "closed"]).optional(),
    clientId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    message: z.string().min(1).optional(),
    newAttachments: z.array(z.string()).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field must be provided",
  })
  .refine(
    (data) => {
      if (data.message !== undefined) {
        return (
          (data.clientId !== undefined && !data.userId) ||
          (!data.clientId && data.userId !== undefined)
        );
      }
      return true;
    },
    {
      message:
        "When sending a message, you must provide exactly one of clientId or userId.",
      path: ["clientId", "userId", "message"],
    }
  );

export type UpdateTicketDTO = z.infer<typeof UpdateTicketSchema>;
