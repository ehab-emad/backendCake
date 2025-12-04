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
exports.TamaraController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const TamaraService_1 = require("../../application/services/TamaraService");
const validation_middleware_1 = require("../middleware/validation.middleware");
const TamaraOrder_dto_1 = require("../../application/dto/TamaraOrder.dto");
const client_1 = require("../../infrastructure/tamara/client");
let TamaraController = class TamaraController {
    constructor(tamaraService) {
        this.tamaraService = tamaraService;
        this.client = new client_1.TamaraClient();
        this.createOrder = [
            (0, validation_middleware_1.validationMiddleware)(TamaraOrder_dto_1.CreateTamaraOrderSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log(res.status);
                    const { checkoutUrl } = yield this.tamaraService.createOrder(req.body);
                    res.status(201).json({ checkoutUrl });
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.refundOrder = [
            (0, validation_middleware_1.validationMiddleware)(TamaraOrder_dto_1.RefundTamaraOrderSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.tamaraService.refundOrder(req.body);
                    res.status(200).json({ message: "Refund processed successfully" });
                }
                catch (err) {
                    console.log("Refund error:", err);
                    next(err);
                }
            }),
        ];
        this.cancelOrder = [
            (0, validation_middleware_1.validationMiddleware)(TamaraOrder_dto_1.CancelTamaraOrderSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                console.log("BODY:", req.body); // لازم تشوفه قبل الفاليديشن
                try {
                    yield this.tamaraService.cancelOrder(req.body);
                    res.status(200).json({ message: "Order cancelled successfully" });
                }
                catch (err) {
                    console.log(err);
                    console.log("BODY:", req.body); // لازم تشوفه قبل الفاليديشن
                    next(err);
                }
            }),
        ];
        this.authoriseOrder = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { orderId } = req.params;
                    yield this.tamaraService.authoriseOrder(orderId);
                    res.status(200).json({ message: "Order authorised successfully" });
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.captureOrder = [
            (0, validation_middleware_1.validationMiddleware)(TamaraOrder_dto_1.CaptureTamaraOrderSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { orderId } = req.params;
                    const dto = Object.assign(Object.assign({}, req.body), { orderId });
                    yield this.tamaraService.captureOrder(dto);
                    res.status(200).json({ message: "Order captured successfully" });
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
    }
};
exports.TamaraController = TamaraController;
exports.TamaraController = TamaraController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TamaraService)),
    __metadata("design:paramtypes", [TamaraService_1.TamaraService])
], TamaraController);
