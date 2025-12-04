import { z } from "zod";

export const RegisterDeviceTokenSchema = z.object({
  token: z.string().min(1),
});
export type RegisterDeviceTokenDTO = z.infer<typeof RegisterDeviceTokenSchema>;
