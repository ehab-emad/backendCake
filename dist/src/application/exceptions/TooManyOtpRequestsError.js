"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyOtpRequestsError = void 0;
class TooManyOtpRequestsError extends Error {
    constructor(retryAfterMs) {
        const minutes = Math.max(0, Math.floor(retryAfterMs / 60000));
        super(`Too many OTP requests. Try again in ${minutes} minute(s).`);
        this.retryAfterMs = retryAfterMs;
        Object.setPrototypeOf(this, TooManyOtpRequestsError.prototype);
    }
}
exports.TooManyOtpRequestsError = TooManyOtpRequestsError;
