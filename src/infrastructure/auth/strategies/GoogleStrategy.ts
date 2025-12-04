import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { v4 as uuid } from "uuid";
import { IAuthRepository } from "../../../core/interfaces/repositories/IAuthRepository";
import { AuthUser } from "../../../core/entities/Auth";
import type { Express } from "express";

export const googleStrategy = (repository: IAuthRepository) =>
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.API_URL || 'http://localhost:3000'}/auth/google/callback`,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    async (
      req: Express.Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      // Log the incoming profile for debugging
      console.log('Google Profile:', JSON.stringify(profile, null, 2));
      try {
        const emails = profile.emails;
        if (!emails?.length) {
          return done(new Error("No email in Google profile."), false);
        }

        const email = emails[0].value;
        let user = await repository.findByEmail(email);

        if (!user) {
          user = new AuthUser(
            uuid(),
            "",
            "",
            email,
            "google",
            undefined,
            profile.id,
            false
          );
          await repository.create(user);
        }

        return done(null, user as unknown as Express.User);
      } catch (err: unknown) {
        const error =
          err instanceof Error
            ? err
            : new Error("Unexpected error in Google OAuth strategy");
        return done(error, false);
      }
    }
  );
