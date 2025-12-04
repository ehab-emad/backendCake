"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUser = void 0;
class AuthUser {
    constructor(id, first_name, last_name, email, provider, password_hash, provider_id, phoneVerified = false, firstName, lastName, phoneNumber, createdAt, updatedAt) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.provider = provider;
        this.password_hash = password_hash;
        this.provider_id = provider_id;
        this.phoneVerified = phoneVerified;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt !== null && createdAt !== void 0 ? createdAt : new Date();
        this.updatedAt = updatedAt !== null && updatedAt !== void 0 ? updatedAt : new Date();
    }
}
exports.AuthUser = AuthUser;
