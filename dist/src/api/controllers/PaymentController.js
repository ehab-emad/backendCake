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
exports.PaymentController = void 0;
const types_1 = require("../../shared/di/types");
const CreatePayment_dto_1 = require("../../application/dto/CreatePayment.dto");
const UpdatePayment_dto_1 = require("../../application/dto/UpdatePayment.dto");
const FilterPayment_dto_1 = require("../../application/dto/FilterPayment.dto");
const StripeSession_dto_1 = require("../../application/dto/StripeSession.dto");
const CreateMamoPayment_dto_1 = require("../../application/dto/CreateMamoPayment.dto");
const InitiatePayment_dto_1 = require("../../application/dto/InitiatePayment.dto");
const PaymentService_1 = require("../../application/services/PaymentService");
const inversify_1 = require("inversify");
const validation_middleware_1 = require("../middleware/validation.middleware");
let PaymentController = class PaymentController {
    constructor(svc) {
        this.svc = svc;
        this.create = [
            (0, validation_middleware_1.validationMiddleware)(CreatePayment_dto_1.CreatePaymentSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const payment = yield this.svc.createPayment(req.body);
                    res.status(201).json(payment);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.list = [
            (0, validation_middleware_1.validationMiddleware)(FilterPayment_dto_1.FilterPaymentSchema, "query"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.svc.listPayments(req.validatedQuery);
                    res.json(result);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield this.svc.getPayment(req.params.id);
                res.json(payment);
            }
            catch (err) {
                next(err);
            }
        });
        this.update = [
            (0, validation_middleware_1.validationMiddleware)(UpdatePayment_dto_1.UpdatePaymentSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const updated = yield this.svc.updatePayment(req.params.id, req.body);
                    res.json(updated);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.deletePayment(req.params.id);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
        this.createStripeSession = [
            (0, validation_middleware_1.validationMiddleware)(StripeSession_dto_1.CreateStripeSessionSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { sessionUrl } = yield this.svc.createStripeSession(req.body);
                    res.json({ sessionUrl });
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.createMamoPayment = [
            (0, validation_middleware_1.validationMiddleware)(CreateMamoPayment_dto_1.CreateMamoPaymentSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { checkoutUrl } = yield this.svc.createMamoPayment(req.body);
                    res.json({ checkoutUrl });
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.initiatePayment = [
            (0, validation_middleware_1.validationMiddleware)(InitiatePayment_dto_1.InitiatePaymentSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.svc.initiatePayment(req.body);
                    res.status(201).json(result);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
    }
};
exports.PaymentController = PaymentController;
exports.PaymentController = PaymentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PaymentService)),
    __metadata("design:paramtypes", [PaymentService_1.PaymentService])
], PaymentController);
