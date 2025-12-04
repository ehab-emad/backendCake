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
exports.ClientAttachmentRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const ClientAttachment_model_1 = require("../models/ClientAttachment.model");
const uuid_1 = require("uuid");
let ClientAttachmentRepository = class ClientAttachmentRepository {
    constructor() {
        this.repo = database_config_1.AppDataSource.getRepository(ClientAttachment_model_1.ClientAttachmentEntity);
    }
    listForClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({
                where: { clientId },
                order: { createdAt: "ASC" },
            });
            return ents.map((e) => ({
                id: e.id,
                path: e.path,
            }));
        });
    }
    add(clientId, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = this.repo.create({
                id: (0, uuid_1.v4)(),
                clientId,
                path: filePath,
            });
            const saved = yield this.repo.save(ent);
            return {
                id: saved.id,
                path: saved.path,
            };
        });
    }
    removeById(attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete({ id: attachmentId });
        });
    }
};
exports.ClientAttachmentRepository = ClientAttachmentRepository;
exports.ClientAttachmentRepository = ClientAttachmentRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ClientAttachmentRepository);
