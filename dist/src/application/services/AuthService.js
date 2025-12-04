"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AuthService = void 0;
const uuid_1 = require("uuid");
const inversify_1 = require("inversify");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const Auth_1 = require("../../core/entities/Auth");
const Token_1 = require("../../core/value-objects/Token");
const SmsService_1 = require("../../infrastructure/sms/SmsService");
const CustomerService_1 = require("./CustomerService");
const types_1 = require("../../shared/di/types");
const Otp_1 = require("../../core/entities/Otp");
const TooManyOtpRequestsError_1 = require("../exceptions/TooManyOtpRequestsError");
let AuthService = class AuthService {
    constructor(repository, config, otpRepo, smsSvc, customerSvc) {
        this.repository = repository;
        this.config = config;
        this.otpRepo = otpRepo;
        this.smsSvc = smsSvc;
        this.customerSvc = customerSvc;
    }
    generateId() {
        return (0, uuid_1.v4)();
    }
    generateJwt(user) {
        return jwt.sign({ userId: user.id }, this.config.JWT_SECRET, {
            expiresIn: "15m",
        });
    }
    register(firstName, lastName, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.repository.findByEmail(email);
            if (exists)
                throw new Error("User already exists");
            const salt = yield bcrypt.genSalt(10);
            const password_hash = yield bcrypt.hash(password, salt);
            const user = new Auth_1.AuthUser(this.generateId(), firstName, lastName, email, "local", password_hash);
            yield this.repository.create(user);
            return user;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findByEmail(email);
            if (!user || !user.password_hash)
                throw new Error("Invalid credentials");
            const ok = yield bcrypt.compare(password, user.password_hash);
            if (!ok)
                throw new Error("Invalid credentials");
            return this.generateTokens(user);
        });
    }
    refreshToken(refreshToken) {
        const payload = jwt.verify(refreshToken, this.config.JWT_REFRESH_SECRET);
        const stubUser = new Auth_1.AuthUser(payload.userId, "", "", null, "local");
        return this.generateTokens(stubUser);
    }
    generateTokens(user) {
        const access = jwt.sign({ userId: user.id }, this.config.JWT_SECRET, {
            expiresIn: "15m",
        });
        const refresh = jwt.sign({ userId: user.id }, this.config.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        return new Token_1.TokenPair(access, refresh, user.id);
    }
    findOrCreateByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repository.findByPhoneNumber(phone);
            if (!user) {
                const id = this.generateId();
                user = new Auth_1.AuthUser(id, "", "", null, "phone", undefined, undefined, false, undefined, undefined, phone);
                yield this.repository.create(user);
                yield this.customerSvc.createCustomer(id, {
                    authUserId: user.id,
                });
            }
            return user;
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findByEmail(email);
            if (!user)
                throw new Error("User not found");
            return user;
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.delete(userId);
        });
    }
    loginWithGoogle(googleUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Find existing user by email or create a new one
                const email = googleUser.email;
                let user = yield this.repository.findByEmail(email);
                // Extract name parts from Google user data
                const firstName = googleUser.given_name || ((_a = googleUser.name) === null || _a === void 0 ? void 0 : _a.split(' ')[0]) || '';
                const lastName = googleUser.family_name || ((_b = googleUser.name) === null || _b === void 0 ? void 0 : _b.split(' ').slice(1).join(' ')) || '';
                const fullName = googleUser.name || googleUser.displayName || `${firstName} ${lastName}`.trim();
                if (!user) {
                    // Create new user from Google profile
                    user = new Auth_1.AuthUser(this.generateId(), firstName, lastName, email, 'google', undefined, // No password for OAuth users
                    googleUser.id, // Google ID as provider_id
                    true, // Email is verified by Google
                    firstName, lastName);
                    yield this.repository.create(user);
                }
                else if (user.provider !== 'google' || !user.provider_id) {
                    // Update existing user with Google provider info if needed
                    user.provider = 'google';
                    user.provider_id = googleUser.id;
                    yield this.repository.update(user);
                }
                // Check if customer exists
                let customerExists = true;
                try {
                    yield this.customerSvc.findByAuthUserId(user.id);
                }
                catch (error) {
                    customerExists = false;
                }
                // If customer doesn't exist, create one
                if (!customerExists) {
                    const customerData = {
                        authUserId: user.id,
                        customername: fullName,
                        email: email,
                        phoneNumber: user.phoneNumber || '',
                        customerType: 'Regular',
                        firstName: firstName || 'User',
                        lastName: lastName || '',
                        profilePicture: googleUser.picture,
                        locale: googleUser.locale,
                        gender: googleUser.gender,
                        nationality: 'Unknown',
                        passportNumber: '',
                        addressLine1: '',
                        city: '',
                        country: '',
                        registrationDate: new Date().toISOString().split('T')[0]
                    };
                    try {
                        yield this.customerSvc.createCustomer(user.id, customerData);
                    }
                    catch (error) {
                        console.error('Error creating customer profile:', error);
                        // Continue with login even if customer profile creation fails
                    }
                }
                // Generate tokens
                return this.generateTokens(user);
            }
            catch (error) {
                console.error('Error in loginWithGoogle:', error);
                throw new Error('Failed to authenticate with Google');
            }
        });
    }
    sendOtp(userId, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const HOUR = 60 * 60 * 1000;
            const since = new Date(now - HOUR);
            const recent = yield this.otpRepo.listRequestsSince(userId, since);
            if (recent.length >= 5) {
                const oldest = recent[0].createdAt.getTime();
                const retryMs = Math.max(0, oldest + HOUR - now);
                throw new TooManyOtpRequestsError_1.TooManyOtpRequestsError(retryMs);
            }
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const hash = yield bcrypt.hash(code, yield bcrypt.genSalt());
            const expiresAt = new Date(now + 5 * 60 * 1000);
            const createdAt = new Date(now);
            yield this.otpRepo.create(new Otp_1.Otp(this.generateId(), userId, hash, expiresAt, createdAt));
            yield this.smsSvc.sendSms(phone, `Your login code is: ${code}`);
        });
    }
    verifyOtp(userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const cands = yield this.otpRepo.findValid(userId);
            for (const otp of cands) {
                if (yield bcrypt.compare(code, otp.hash)) {
                    yield Promise.all(cands.map((o) => this.otpRepo.delete(o.id)));
                    const user = yield this.repository.findById(userId);
                    if (user) {
                        user.phoneVerified = true;
                        yield this.repository.update(user);
                    }
                    return;
                }
            }
            throw new Error("Invalid or expired code");
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AuthRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.Config)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.OtpRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.SmsService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.CustomerService)),
    __metadata("design:paramtypes", [Object, Object, Object, SmsService_1.SmsService,
        CustomerService_1.CustomerService])
], AuthService);
