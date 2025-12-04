import { z } from "zod";
import { CreateCustomerSchema } from "../../application/dto/CreateCustomer.dto";

export const RegisterAndProfileSchema = CreateCustomerSchema.omit({
  authUserId: true,
}).extend({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),

  password: z.string(),
});

export type RegisterAndProfileDTO = z.infer<typeof RegisterAndProfileSchema>;
