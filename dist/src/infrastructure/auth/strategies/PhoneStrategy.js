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
exports.phoneStrategy = phoneStrategy;
const passport_custom_1 = require("passport-custom");
const TooManyOtpRequestsError_1 = require("../../../application/exceptions/TooManyOtpRequestsError");
function phoneStrategy(authSvc) {
    const strat = new passport_custom_1.Strategy((req, done) => __awaiter(this, void 0, void 0, function* () {
        const { phone_number, code } = req.body;
        if (!phone_number) {
            return done(new Error("Phone number is required"), false);
        }
        try {
            if (!code) {
                const user = yield authSvc.findOrCreateByPhone(phone_number);
                yield authSvc.sendOtp(user.id, phone_number);
                return done(null, false, { message: "OTP sent" });
            }
            const preUser = yield authSvc.findOrCreateByPhone(phone_number);
            yield authSvc.verifyOtp(preUser.id, code);
            const user = yield authSvc.findOrCreateByPhone(phone_number);
            if (!user.phoneVerified) {
                return done(null, false, { message: "Phone verification failed" });
            }
            return done(null, user);
        }
        catch (err) {
            if (err instanceof TooManyOtpRequestsError_1.TooManyOtpRequestsError) {
                return done(null, false, { message: err.message });
            }
            const error = err instanceof Error ? err : new Error("Unknown error");
            if (error.message === "Invalid or expired code") {
                return done(null, false, { message: error.message });
            }
            return done(error, false);
        }
    }));
    Object.defineProperty(strat, "name", { value: "phone" });
    return strat;
}
