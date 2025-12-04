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
exports.OtpRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const database_config_1 = require("../../config/database.config");
const Otp_model_1 = require("../models/Otp.model");
const Otp_1 = require("../../../core/entities/Otp");
let OtpRepository = class OtpRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized) {
            throw new Error("Data source is not initialized");
        }
        return database_config_1.AppDataSource.getRepository(Otp_model_1.OtpEntity);
    }
    create(o) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = this.repo.create({
                id: o.id,
                user_id: o.userId,
                hash: o.hash,
                expires_at: o.expiresAt,
                createdAt: o.createdAt,
            });
            yield this.repo.save(ent);
        });
    }
    findValid(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const ents = yield this.repo.find({
                where: { user_id: userId, expires_at: (0, typeorm_1.MoreThan)(now) },
            });
            return ents.map((e) => new Otp_1.Otp(e.id, e.user_id, e.hash, e.expires_at, e.createdAt));
        });
    }
    countRequestsSince(userId, since) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.count({
                where: { user_id: userId, createdAt: (0, typeorm_1.MoreThan)(since) },
            });
        });
    }
    listRequestsSince(userId, since) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({
                where: { user_id: userId, createdAt: (0, typeorm_1.MoreThan)(since) },
                order: { createdAt: "ASC" },
            });
            return ents.map((e) => new Otp_1.Otp(e.id, e.user_id, e.hash, e.expires_at, e.createdAt));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
};
exports.OtpRepository = OtpRepository;
exports.OtpRepository = OtpRepository = __decorate([
    (0, inversify_1.injectable)()
], OtpRepository);
