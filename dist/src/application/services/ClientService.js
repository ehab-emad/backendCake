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
exports.ClientService = void 0;
const uuid_1 = require("uuid");
const inversify_1 = require("inversify");
const ConflictError_1 = require("../exceptions/ConflictError");
const NotFoundException_1 = require("../exceptions/NotFoundException");
const types_1 = require("../../shared/di/types");
const Client_model_1 = require("../../infrastructure/database/models/Client.model");
const ClientAttachment_model_1 = require("../../infrastructure/database/models/ClientAttachment.model");
let ClientService = class ClientService {
    constructor(repo, attachRepo, dataSource) {
        this.repo = repo;
        this.attachRepo = attachRepo;
        this.dataSource = dataSource;
    }
    createClient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.repo.findByEmail(data.email)) {
                throw new ConflictError_1.ConflictError("Email already in use");
            }
            const clientId = (0, uuid_1.v4)();
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const now = new Date();
                yield manager.getRepository(Client_model_1.ClientEntity).save({
                    id: clientId,
                    name: data.name,
                    email: data.email,
                    address: data.address,
                    phone: data.phone,
                    profileImage: data.profileImage,
                    licenseNumber: data.licenseNumber,
                    city: data.city,
                    websiteUrl: data.websiteUrl,
                    additionalPhoneNumber: data.additionalPhoneNumber,
                    subscriptionType: data.subscriptionType,
                    rating: (_a = data.rating) !== null && _a !== void 0 ? _a : 0,
                    approved: (_b = data.approved) !== null && _b !== void 0 ? _b : false,
                    active: (_c = data.active) !== null && _c !== void 0 ? _c : true,
                    createdAt: now,
                    updatedAt: now
                });
                if ((_d = data.attachments) === null || _d === void 0 ? void 0 : _d.length) {
                    const attRepo = manager.getRepository(ClientAttachment_model_1.ClientAttachmentEntity);
                    for (const path of data.attachments) {
                        yield attRepo.save({ id: (0, uuid_1.v4)(), clientId, path });
                    }
                }
            }));
            return this.getClient(clientId);
        });
    }
    listClients() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.findAll();
        });
    }
    getClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.repo.findById(id);
            if (!client)
                throw new NotFoundException_1.NotFoundException("Client not found");
            return client;
        });
    }
    updateClient(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.repo.findById(id);
            if (!existing)
                throw new NotFoundException_1.NotFoundException("Client not found");
            if (data.email && data.email !== existing.email) {
                if (yield this.repo.findByEmail(data.email)) {
                    throw new ConflictError_1.ConflictError("Email already in use");
                }
            }
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const upd = {
                    name: data.name,
                    email: data.email,
                    address: data.address,
                    phone: data.phone,
                    profileImage: data.profileImage,
                    licenseNumber: data.licenseNumber,
                    city: data.city,
                    websiteUrl: data.websiteUrl,
                    additionalPhoneNumber: data.additionalPhoneNumber,
                    subscriptionType: data.subscriptionType,
                    rating: data.rating,
                    approved: data.approved,
                    active: data.active,
                    // Always update the updated_at timestamp
                    updatedAt: new Date()
                };
                // Remove undefined values to avoid overwriting with null
                Object.keys(upd).forEach(key => {
                    if (upd[key] === undefined) {
                        delete upd[key];
                    }
                });
                yield manager.getRepository(Client_model_1.ClientEntity).update(id, upd);
            }));
            return this.getClient(id);
        });
    }
    deleteClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    listAttachments(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getClient(clientId);
            return this.attachRepo.listForClient(clientId);
        });
    }
    addAttachment(clientId, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getClient(clientId);
            yield this.attachRepo.add(clientId, filePath);
            return this.attachRepo.listForClient(clientId);
        });
    }
    removeAttachmentById(clientId, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getClient(clientId);
            yield this.attachRepo.removeById(attachmentId);
            return this.attachRepo.listForClient(clientId);
        });
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ClientRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ClientAttachmentRepository)),
    __param(2, (0, inversify_1.inject)("DataSource")),
    __metadata("design:paramtypes", [Object, Object, Function])
], ClientService);
