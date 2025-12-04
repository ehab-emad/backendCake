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
exports.DeviceTokenRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const DeviceTokenController_1 = require("../controllers/DeviceTokenController");
const types_1 = require("../../shared/di/types");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
let DeviceTokenRoutes = class DeviceTokenRoutes {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.router = (0, express_1.Router)();
        this.router.post("/", AuthMiddleware_1.authenticateJWT, ...this.ctrl.register);
    }
};
exports.DeviceTokenRoutes = DeviceTokenRoutes;
exports.DeviceTokenRoutes = DeviceTokenRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.DeviceTokenController)),
    __metadata("design:paramtypes", [DeviceTokenController_1.DeviceTokenController])
], DeviceTokenRoutes);
