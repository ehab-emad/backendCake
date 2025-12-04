"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_CONFIG = exports.OAUTH_CONFIG = exports.JWT_CONFIG = exports.AUTH_CONFIG = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, "../../../.env") });
const AuthConfigSchema = zod_1.z.object({
    secret: zod_1.z.string().min(32, "JWT secret must be at least 32 characters"),
    refreshSecret: zod_1.z
        .string()
        .min(32, "Refresh secret must be at least 32 characters"),
    accessExpiresIn: zod_1.z.string().default("15m"),
    refreshExpiresIn: zod_1.z.string().default("7d"),
    googleClientId: zod_1.z.string().optional(),
    googleClientSecret: zod_1.z.string().optional(),
    appleClientId: zod_1.z.string().optional(),
    appleTeamId: zod_1.z.string().optional(),
    appleKeyId: zod_1.z.string().optional(),
    applePrivateKey: zod_1.z.string().optional(),
    cookieDomain: zod_1.z.string().optional(),
    cookieSecure: zod_1.z.coerce.boolean().default(false),
});
exports.AUTH_CONFIG = AuthConfigSchema.parse({
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
exports.JWT_CONFIG = {
    secret: exports.AUTH_CONFIG.secret,
    refreshSecret: exports.AUTH_CONFIG.refreshSecret,
    accessExpiresIn: exports.AUTH_CONFIG.accessExpiresIn,
    refreshExpiresIn: exports.AUTH_CONFIG.refreshExpiresIn,
};
exports.OAUTH_CONFIG = {
    google: {
        clientID: exports.AUTH_CONFIG.googleClientId,
        clientSecret: exports.AUTH_CONFIG.googleClientSecret,
        callbackURL: "/auth/google/callback",
    },
    apple: {
        clientID: exports.AUTH_CONFIG.appleClientId,
        teamID: exports.AUTH_CONFIG.appleTeamId,
        keyID: exports.AUTH_CONFIG.appleKeyId,
        privateKey: exports.AUTH_CONFIG.applePrivateKey,
        callbackURL: "/auth/apple/callback",
    },
};
exports.COOKIE_CONFIG = {
    domain: exports.AUTH_CONFIG.cookieDomain,
    secure: exports.AUTH_CONFIG.cookieSecure,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
