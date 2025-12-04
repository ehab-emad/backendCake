"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.authConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || "default_jwt_secret",
        expiresIn: "7d",
    },
    session: {
        secret: process.env.SESSION_SECRET || "default_session_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        },
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL ||
            "http://localhost:3000/auth/google/callback",
    },
    apple: {
        clientID: process.env.APPLE_CLIENT_ID || "",
        teamID: process.env.APPLE_TEAM_ID || "",
        keyID: process.env.APPLE_KEY_ID || "",
        privateKey: ((_a = process.env.APPLE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n")) || "",
        callbackURL: process.env.APPLE_CALLBACK_URL ||
            "http://localhost:3000/auth/apple/callback",
    },
};
