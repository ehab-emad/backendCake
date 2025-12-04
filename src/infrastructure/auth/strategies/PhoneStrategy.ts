import { Strategy as CustomStrategy } from "passport-custom";
import type { Request } from "express";
import { AuthService } from "../../../application/services/AuthService";
import type { AuthUser } from "../../../core/entities/Auth";
import { TooManyOtpRequestsError } from "../../../application/exceptions/TooManyOtpRequestsError";

export function phoneStrategy(authSvc: AuthService) {
  const strat = new CustomStrategy(
    async (
      req: Request,
      done: (
        err: Error | null,
        user?: AuthUser | false,
        info?: { message?: string }
      ) => void
    ) => {
      const { phone_number, code } = req.body as {
        phone_number?: string;
        code?: string;
      };

      if (!phone_number) {
        return done(new Error("Phone number is required"), false);
      }

      try {
        if (!code) {
          const user = await authSvc.findOrCreateByPhone(phone_number);
          await authSvc.sendOtp(user.id, phone_number);
          return done(null, false, { message: "OTP sent" });
        }

        const preUser = await authSvc.findOrCreateByPhone(phone_number);
        await authSvc.verifyOtp(preUser.id, code);

        const user = await authSvc.findOrCreateByPhone(phone_number);
        if (!user.phoneVerified) {
          return done(null, false, { message: "Phone verification failed" });
        }

        return done(null, user);
      } catch (err: unknown) {
        if (err instanceof TooManyOtpRequestsError) {
          return done(null, false, { message: err.message });
        }

        const error = err instanceof Error ? err : new Error("Unknown error");

        if (error.message === "Invalid or expired code") {
          return done(null, false, { message: error.message });
        }

        return done(error, false);
      }
    }
  );

  Object.defineProperty(strat, "name", { value: "phone" });

  return strat;
}
