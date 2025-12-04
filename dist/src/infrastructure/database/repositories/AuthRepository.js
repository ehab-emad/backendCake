"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AuthRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Auth_model_1 = require("../models/Auth.model");
const Auth_1 = require("../../../core/entities/Auth");
let AuthRepository = class AuthRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized) {
            throw new Error("Data source is not initialized");
        }
        return database_config_1.AppDataSource.getRepository(Auth_model_1.AuthEntity);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo.findOneBy({ email });
            return ent ? this.toDomain(ent) : null;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo.findOneBy({ id });
            return ent ? this.toDomain(ent) : null;
        });
    }
    findByProviderId(provider, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo.findOneBy({ provider, providerId });
            return ent ? this.toDomain(ent) : null;
        });
    }
    findByPhoneNumber(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo.findOneBy({ phoneNumber: phone });
            return ent ? this.toDomain(ent) : null;
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(user));
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(user));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    toDomain(ent) {
        var _a;
        return new Auth_1.AuthUser(ent.id, ent.firstName, ent.lastName, ent.email, ent.provider, ent.passwordHash, (_a = ent.providerId) !== null && _a !== void 0 ? _a : undefined, ent.phoneVerified, ent.firstName, ent.lastName, ent.phoneNumber);
    }
    toEntity(user) {
        var _a, _b, _c, _d;
        const ent = new Auth_model_1.AuthEntity();
        ent.id = user.id;
        ent.firstName = user.firstName;
        ent.lastName = user.lastName;
        ent.email = (_a = user.email) !== null && _a !== void 0 ? _a : null;
        ent.phoneNumber = user.phoneNumber;
        ent.passwordHash = (_b = user.password_hash) !== null && _b !== void 0 ? _b : "";
        ent.provider = user.provider;
        ent.providerId = (_c = user.provider_id) !== null && _c !== void 0 ? _c : null;
        ent.phoneVerified = (_d = user.phoneVerified) !== null && _d !== void 0 ? _d : false;
        return ent;
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, inversify_1.injectable)()
], AuthRepository);
