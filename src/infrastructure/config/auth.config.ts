import { config } from "dotenv";
import { z } from "zod";
import path from "path";

config({ path: path.resolve(__dirname, "../../../.env") });

const AuthConfigSchema = z.object({
  secret: z.string().min(32, "JWT secret must be at least 32 characters"),
  refreshSecret: z
    .string()
    .min(32, "Refresh secret must be at least 32 characters"),
  accessExpiresIn: z.string().default("15m"),
  refreshExpiresIn: z.string().default("7d"),
  googleClientId: z.string().optional(),
  googleClientSecret: z.string().optional(),
  appleClientId: z.string().optional(),
  appleTeamId: z.string().optional(),
  appleKeyId: z.string().optional(),
  applePrivateKey: z.string().optional(),
  cookieDomain: z.string().optional(),
  cookieSecure: z.coerce.boolean().default(false),
});

export type AuthConfig = z.infer<typeof AuthConfigSchema>;

export const AUTH_CONFIG: AuthConfig = AuthConfigSchema.parse({
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  appleClientId: process.env.APPLE_CLIENT_ID,
  appleTeamId: process.env.APPLE_TEAM_ID,
  appleKeyId: process.env.APPLE_KEY_ID,
  applePrivateKey: process.env.APPLE_PRIVATE_KEY,
  cookieDomain: process.env.COOKIE_DOMAIN,
  cookieSecure: process.env.COOKIE_SECURE,
});

export const JWT_CONFIG = {
  secret: AUTH_CONFIG.secret,
  refreshSecret: AUTH_CONFIG.refreshSecret,
  accessExpiresIn: AUTH_CONFIG.accessExpiresIn,
  refreshExpiresIn: AUTH_CONFIG.refreshExpiresIn,
};

export const OAUTH_CONFIG = {
  google: {
    clientID: AUTH_CONFIG.googleClientId,
    clientSecret: AUTH_CONFIG.googleClientSecret,
    callbackURL: "/auth/google/callback",
  },
  apple: {
    clientID: AUTH_CONFIG.appleClientId,
    teamID: AUTH_CONFIG.appleTeamId,
    keyID: AUTH_CONFIG.appleKeyId,
    privateKey: AUTH_CONFIG.applePrivateKey,
    callbackURL: "/auth/apple/callback",
  },
};

export const COOKIE_CONFIG = {
  domain: AUTH_CONFIG.cookieDomain,
  secure: AUTH_CONFIG.cookieSecure,
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
