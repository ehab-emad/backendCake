import dotenv from "dotenv";
dotenv.config();

export const authConfig = {
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
    callbackURL:
      process.env.GOOGLE_CALLBACK_URL ||
      "http://localhost:3000/auth/google/callback",
  },
  apple: {
    clientID: process.env.APPLE_CLIENT_ID || "",
    teamID: process.env.APPLE_TEAM_ID || "",
    keyID: process.env.APPLE_KEY_ID || "",
    privateKey: process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
    callbackURL:
      process.env.APPLE_CALLBACK_URL ||
      "http://localhost:3000/auth/apple/callback",
  },
};
