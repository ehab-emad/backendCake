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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const inversify_1 = require("inversify");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const ClientService_1 = require("../../application/services/ClientService");
const types_1 = require("../../shared/di/types");
const CreateClient_dto_1 = require("../../application/dto/CreateClient.dto");
const UpdateClient_dto_1 = require("../../application/dto/UpdateClient.dto");
let ClientController = class ClientController {
    constructor(svc) {
        this.svc = svc;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const dto = CreateClient_dto_1.CreateClientSchema.parse(req.body);
                const files = req.files;
                if ((_a = files === null || files === void 0 ? void 0 : files.profileImage) === null || _a === void 0 ? void 0 : _a.length) {
                    dto.profileImage = files.profileImage[0].path;
                }
                if ((_b = files === null || files === void 0 ? void 0 : files.attachments) === null || _b === void 0 ? void 0 : _b.length) {
                    dto.attachments = files.attachments.map((f) => f.path);
                }
                const client = yield this.svc.createClient(dto);
                res.status(201).json(client);
            }
            catch (err) {
                next(err);
            }
        });
        this.list = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clients = yield this.svc.listClients();
                res.json(clients);
            }
            catch (err) {
                next(err);
            }
        });
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.svc.getClient(req.params.id);
                res.json(client);
            }
            catch (err) {
                next(err);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const dto = UpdateClient_dto_1.UpdateClientSchema.parse(req.body);
                const files = req.files;
                const existing = yield this.svc.getClient(req.params.id);
                if (((_a = files === null || files === void 0 ? void 0 : files.profileImage) === null || _a === void 0 ? void 0 : _a.length) && existing.profileImage) {
                    yield promises_1.default.unlink(path_1.default.resolve(existing.profileImage)).catch(() => { });
                    dto.profileImage = files.profileImage[0].path;
                }
                if ((_b = files === null || files === void 0 ? void 0 : files.attachments) === null || _b === void 0 ? void 0 : _b.length) {
                    for (const f of files.attachments) {
                        yield this.svc.addAttachment(req.params.id, f.path);
                    }
                }
                const updated = yield this.svc.updateClient(req.params.id, dto);
                res.json(updated);
            }
            catch (err) {
                next(err);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.deleteClient(req.params.id);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
        this.listAttachments = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const list = yield this.svc.listAttachments(req.params.id);
                res.json(list);
            }
            catch (err) {
                next(err);
            }
        });
        this.addAttachment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                if (!file) {
                    res.status(400).json({ error: "No file uploaded" });
                    return;
                }
                const updated = yield this.svc.addAttachment(req.params.id, file.path);
                res.status(201).json(updated);
            }
            catch (err) {
                next(err);
            }
        });
        this.removeAttachmentById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: clientId, attachmentId } = req.params;
                const attachments = yield this.svc.listAttachments(clientId);
                const found = attachments.find((a) => a.id === attachmentId);
                if (!found) {
                    res.status(404).json({ error: "Attachment not found." });
                    return;
                }
                yield promises_1.default.unlink(path_1.default.resolve(found.path)).catch(() => { });
                const updated = yield this.svc.removeAttachmentById(clientId, attachmentId);
                res.json(updated);
            }
            catch (err) {
                next(err);
            }
        });
    }
};
exports.ClientController = ClientController;
exports.ClientController = ClientController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ClientService)),
    __metadata("design:paramtypes", [ClientService_1.ClientService])
], ClientController);
