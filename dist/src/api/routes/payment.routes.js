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
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const PaymentController_1 = require("../controllers/PaymentController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
let PaymentRoutes = class PaymentRoutes {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.post("/", AuthMiddleware_1.authenticateJWT, ...this.ctrl.create);
        const [listValidator, listHandler] = this.ctrl.list;
        this.router.get("/", AuthMiddleware_1.authenticateJWT, listValidator, listHandler);
        this.router
            .get("/:id", AuthMiddleware_1.authenticateJWT, this.ctrl.get)
            .put("/:id", AuthMiddleware_1.authenticateJWT, ...this.ctrl.update)
            .delete("/:id", AuthMiddleware_1.authenticateJWT, this.ctrl.delete);
        this.router.post("/stripe/session", AuthMiddleware_1.authenticateJWT, ...this.ctrl.createStripeSession);
        this.router.post("/mamo", AuthMiddleware_1.authenticateJWT, ...this.ctrl.createMamoPayment);
        this.router.post("/initiate", AuthMiddleware_1.authenticateJWT, ...this.ctrl.initiatePayment);
    }
};
exports.PaymentRoutes = PaymentRoutes;
exports.PaymentRoutes = PaymentRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PaymentController)),
    __metadata("design:paramtypes", [PaymentController_1.PaymentController])
], PaymentRoutes);
