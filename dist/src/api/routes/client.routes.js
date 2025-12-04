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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const upload_1 = require("../../shared/upload");
const validation_middleware_1 = require("../middleware/validation.middleware");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const types_1 = require("../../shared/di/types");
const ClientController_1 = require("../controllers/ClientController");
const CreateClient_dto_1 = require("../../application/dto/CreateClient.dto");
const UpdateClient_dto_1 = require("../../application/dto/UpdateClient.dto");
let ClientRoutes = class ClientRoutes {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.get("/", this.ctrl.list);
        this.router.get("/:id", this.ctrl.get);
        this.router.post("/", AuthMiddleware_1.authenticateJWT, upload_1.upload.fields([
            { name: "profileImage", maxCount: 1 },
            { name: "attachments", maxCount: 10 },
        ]), (0, validation_middleware_1.validationMiddleware)(CreateClient_dto_1.CreateClientSchema), this.ctrl.create);
        this.router.put("/:id", AuthMiddleware_1.authenticateJWT, upload_1.upload.fields([
            { name: "profileImage", maxCount: 1 },
            { name: "attachments", maxCount: 10 },
        ]), (0, validation_middleware_1.validationMiddleware)(UpdateClient_dto_1.UpdateClientSchema), this.ctrl.update);
        this.router.delete("/:id", AuthMiddleware_1.authenticateJWT, this.ctrl.delete);
        this.router.get("/:id/attachments", AuthMiddleware_1.authenticateJWT, this.ctrl.listAttachments);
        this.router.post("/:id/attachments", AuthMiddleware_1.authenticateJWT, upload_1.upload.single("attachment"), this.ctrl.addAttachment);
        this.router.delete("/:id/attachments/:attachmentId", AuthMiddleware_1.authenticateJWT, this.ctrl.removeAttachmentById);
    }
};
exports.ClientRoutes = ClientRoutes;
exports.ClientRoutes = ClientRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ClientController)),
    __metadata("design:paramtypes", [ClientController_1.ClientController])
], ClientRoutes);
