"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPair = void 0;
class TokenPair {
    constructor(accessToken, refreshToken, userId) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
    }
}
exports.TokenPair = TokenPair;
