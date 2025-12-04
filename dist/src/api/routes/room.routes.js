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
exports.RoomRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const RoomController_1 = require("../controllers/RoomController");
const validation_middleware_1 = require("../middleware/validation.middleware");
const FilterRoom_dto_1 = require("../../application/dto/FilterRoom.dto");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
let RoomRoutes = class RoomRoutes {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.router = (0, express_1.Router)();
        this.router.post("/", AuthMiddleware_1.authenticateJWT, ...this.ctrl.create);
        this.router.get("/", 
        // authenticateJWT,
        (0, validation_middleware_1.validationMiddleware)(FilterRoom_dto_1.FilterRoomSchema, "query"), ...this.ctrl.list);
        this.router.get("/:id", 
        // authenticateJWT, 
        this.ctrl.get);
        this.router.put("/:id", AuthMiddleware_1.authenticateJWT, ...this.ctrl.update);
        this.router.delete("/:id", AuthMiddleware_1.authenticateJWT, this.ctrl.delete);
        this.router.delete("/:id/images/:imageId", AuthMiddleware_1.authenticateJWT, this.ctrl.removeImage);
        this.router.delete("/:id/amenities/:amenityId", AuthMiddleware_1.authenticateJWT, this.ctrl.removeAmenity);
    }
};
exports.RoomRoutes = RoomRoutes;
exports.RoomRoutes = RoomRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.RoomController)),
    __metadata("design:paramtypes", [RoomController_1.RoomController])
], RoomRoutes);
