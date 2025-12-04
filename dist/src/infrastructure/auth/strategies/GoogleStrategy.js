"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleStrategy = void 0;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const uuid_1 = require("uuid");
const Auth_1 = require("../../../core/entities/Auth");
const googleStrategy = (repository) => new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL || 'http://localhost:3000'}/auth/google/callback`,
    passReqToCallback: true,
    scope: ['profile', 'email'],
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    // Log the incoming profile for debugging
    console.log('Google Profile:', JSON.stringify(profile, null, 2));
    try {
        const emails = profile.emails;
        if (!(emails === null || emails === void 0 ? void 0 : emails.length)) {
            return done(new Error("No email in Google profile."), false);
        }
        const email = emails[0].value;
        let user = yield repository.findByEmail(email);
        if (!user) {
            user = new Auth_1.AuthUser((0, uuid_1.v4)(), "", "", email, "google", undefined, profile.id, false);
            yield repository.create(user);
        }
        return done(null, user);
    }
    catch (err) {
        const error = err instanceof Error
            ? err
            : new Error("Unexpected error in Google OAuth strategy");
        return done(error, false);
    }
}));
exports.googleStrategy = googleStrategy;
