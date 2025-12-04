"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TamaraRoutes = void 0;
const express_1 = __importStar(require("express")); // ✅ استورد express كمان
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const TamaraController_1 = require("../controllers/TamaraController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const TamaraWebhookController_1 = require("../controllers/TamaraWebhookController");
let TamaraRoutes = class TamaraRoutes {
    constructor(ctrl, webhookCtrl) {
        this.ctrl = ctrl;
        this.webhookCtrl = webhookCtrl;
        this.router = (0, express_1.Router)();
        this.router.post("/tamara/order", AuthMiddleware_1.authenticateJWT, ...this.ctrl.createOrder);
        this.router.post("/tamara/order/refund", AuthMiddleware_1.authenticateJWT, ...this.ctrl.refundOrder);
        this.router.post("/tamara/order/:orderId/authorise", AuthMiddleware_1.authenticateJWT, this.ctrl.authoriseOrder);
        this.router.post("/tamara/order/:orderId/capture", AuthMiddleware_1.authenticateJWT, ...this.ctrl.captureOrder);
        this.router.post("/tamara/order/cancel", AuthMiddleware_1.authenticateJWT, ...this.ctrl.cancelOrder);
        this.router.post("/tamara/webhook", express_1.default.json(), // ✅ تم التصحيح
        this.webhookCtrl.handleWebhook);
    }
};
exports.TamaraRoutes = TamaraRoutes;
exports.TamaraRoutes = TamaraRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TamaraController)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TamaraWebhookController)),
    __metadata("design:paramtypes", [TamaraController_1.TamaraController,
        TamaraWebhookController_1.TamaraWebhookController])
], TamaraRoutes);
