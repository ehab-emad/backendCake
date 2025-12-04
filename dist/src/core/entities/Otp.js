"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
class Otp {
    constructor(id, userId, hash, createdAt, expiresAt) {
        this.id = id;
        this.userId = userId;
        this.hash = hash;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }
}
exports.Otp = Otp;
