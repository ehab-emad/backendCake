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
exports.ReservationRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const ReservationController_1 = require("../controllers/ReservationController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
let ReservationRoutes = class ReservationRoutes {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.router = (0, express_1.Router)();
        this.router.post("/", AuthMiddleware_1.authenticateJWT, ...this.ctrl.create);
        this.router.get("/", ...this.ctrl.list);
        this.router.get("/:id", AuthMiddleware_1.authenticateJWT, this.ctrl.get);
        this.router.put("/:_id", AuthMiddleware_1.authenticateJWT, ...this.ctrl.update);
        this.router.delete("/:_id", AuthMiddleware_1.authenticateJWT, this.ctrl.delete);
        // Payment webhook endpoint (no auth as it's called by payment providers)
        this.router.post("/webhooks/:gateway", this.ctrl.handlePaymentWebhook);
        // Cancel reservation endpoint
        this.router.post("/:id/cancel", AuthMiddleware_1.authenticateJWT, this.ctrl.cancelReservation);
        // Add other payment-related routes here if needed
    }
};
exports.ReservationRoutes = ReservationRoutes;
exports.ReservationRoutes = ReservationRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ReservationController)),
    __metadata("design:paramtypes", [ReservationController_1.ReservationController])
], ReservationRoutes);
