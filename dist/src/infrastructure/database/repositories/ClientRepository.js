"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.ClientRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Client_model_1 = require("../models/Client.model");
const Client_1 = require("../../../core/entities/Client");
let ClientRepository = class ClientRepository {
    constructor() {
        this.repo = database_config_1.AppDataSource.getRepository(Client_model_1.ClientEntity);
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo.findOne({
                where: { id },
                relations: ["attachments"],
            });
            return ent ? this.toDomain(ent) : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({ relations: ["attachments"] });
            return ents.map((e) => this.toDomain(e));
        });
    }
    create(client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(client));
        });
    }
    update(client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(client));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo.findOne({
                where: { email },
                relations: ["attachments"],
            });
            return ent ? this.toDomain(ent) : null;
        });
    }
    findByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo.findOne({
                where: { phone },
                relations: ["attachments"],
            });
            return ent ? this.toDomain(ent) : null;
        });
    }
    toDomain(ent) {
        var _a, _b, _c, _d, _e, _f, _g;
        const attachments = (_b = (_a = ent.attachments) === null || _a === void 0 ? void 0 : _a.map((a) => a.path)) !== null && _b !== void 0 ? _b : [];
        return new Client_1.Client(ent.id, ent.name, ent.email, typeof ent.rating === 'string' ? parseFloat(ent.rating) : (ent.rating || 0), (_c = ent.address) !== null && _c !== void 0 ? _c : undefined, (_d = ent.phone) !== null && _d !== void 0 ? _d : undefined, (_e = ent.profileImage) !== null && _e !== void 0 ? _e : undefined, attachments, (_f = ent.licenseNumber) !== null && _f !== void 0 ? _f : undefined, ent.city, ent.websiteUrl, ent.additionalPhoneNumber, (_g = ent.subscriptionType) !== null && _g !== void 0 ? _g : undefined, ent.approved, ent.active, ent.createdAt, ent.updatedAt);
    }
    toEntity(client) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const ent = new Client_model_1.ClientEntity();
        ent.id = client.id;
        ent.name = client.name;
        ent.email = client.email;
        ent.address = (_a = client.address) !== null && _a !== void 0 ? _a : null;
        ent.phone = (_b = client.phone) !== null && _b !== void 0 ? _b : null;
        ent.profileImage = (_c = client.profileImage) !== null && _c !== void 0 ? _c : null;
        ent.licenseNumber = (_d = client.licenseNumber) !== null && _d !== void 0 ? _d : null;
        ent.city = (_e = client.city) !== null && _e !== void 0 ? _e : null;
        ent.websiteUrl = (_f = client.websiteUrl) !== null && _f !== void 0 ? _f : null;
        ent.additionalPhoneNumber = (_g = client.additionalPhoneNumber) !== null && _g !== void 0 ? _g : null;
        ent.subscriptionType = (_h = client.subscriptionType) !== null && _h !== void 0 ? _h : null;
        ent.rating = typeof client.rating === 'string' ? parseFloat(client.rating) : (client.rating || 0);
        ent.approved = client.approved;
        ent.active = client.active;
        // Preserve the original created_at timestamp if it exists
        if (client.createdAt) {
            ent.createdAt = client.createdAt;
        }
        // Always update the updated_at timestamp to current time
        ent.updatedAt = new Date();
        return ent;
    }
};
exports.ClientRepository = ClientRepository;
exports.ClientRepository = ClientRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ClientRepository);
