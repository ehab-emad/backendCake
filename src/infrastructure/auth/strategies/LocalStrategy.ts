import {
  Strategy as PassportLocalStrategy,
  IStrategyOptions,
  VerifyFunction,
} from "passport-local";
import { IAuthRepository } from "../../../core/interfaces/repositories/IAuthRepository";
import * as bcrypt from "bcrypt";

export const localStrategy = (
  repository: IAuthRepository
): PassportLocalStrategy => {
  const options: IStrategyOptions = {
    usernameField: "email",
    passwordField: "password",
    session: false,
  };

  const verify: VerifyFunction = (email, password, done) => {
    repository
      .findByEmail(email)
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        return bcrypt.compare(password, user.password_hash ?? "").then((ok) => {
          if (!ok) {
            return done(null, false);
          }
          done(null, user as unknown as Express.User);
        });
      })
      .catch((err) => {
        done(err);
      });
  };

  return new PassportLocalStrategy(options, verify);
};
