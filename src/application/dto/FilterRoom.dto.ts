import { z } from "zod";

export const FilterRoomSchema = z.object({
  clientId: z.string().uuid().optional(),
  hotelId: z.string().uuid().optional(),
  status: z.enum(["all", "active", "not_active"]).optional(),
  name: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export type FilterRoomDTO = z.infer<typeof FilterRoomSchema>;
