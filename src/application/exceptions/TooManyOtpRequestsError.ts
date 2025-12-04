export class TooManyOtpRequestsError extends Error {
  public readonly retryAfterMs: number;

  constructor(retryAfterMs: number) {
    const minutes = Math.max(0, Math.floor(retryAfterMs / 60000));
    super(`Too many OTP requests. Try again in ${minutes} minute(s).`);
    this.retryAfterMs = retryAfterMs;
    Object.setPrototypeOf(this, TooManyOtpRequestsError.prototype);
  }
}
