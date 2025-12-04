import passport from "passport";
import type { IAuthRepository } from "../../core/interfaces/repositories/IAuthRepository";
import type { AuthService } from "../../application/services/AuthService";
import { localStrategy } from "./strategies/LocalStrategy";
import { googleStrategy } from "./strategies/GoogleStrategy";
import { phoneStrategy } from "./strategies/PhoneStrategy";

export const initializePassport = (
  authRepository: IAuthRepository,
  authService: AuthService
): void => {
  passport.use(localStrategy(authRepository));

  passport.use(googleStrategy(authRepository));

  passport.use(phoneStrategy(authService));
};
