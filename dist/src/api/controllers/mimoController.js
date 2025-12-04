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
exports.MimoController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const validation_middleware_1 = require("../middleware/validation.middleware");
const mimoService_1 = require("../../application/services/mimoService");
const mimoOrder_dto_1 = require("../../application/dto/mimoOrder.dto");
let MimoController = class MimoController {
    constructor(mimoService) {
        this.mimoService = mimoService;
        this.createPaymentLink = [
            (0, validation_middleware_1.validationMiddleware)(mimoOrder_dto_1.CreateMamoLinkSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const link = yield this.mimoService.createPaymentLink(req.body);
                    res.status(201).json(link);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.createOrder = [
            (0, validation_middleware_1.validationMiddleware)(mimoOrder_dto_1.CreateMamoLinkSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.mimoService.createPaymentLink(req.body);
                    res.status(201).json(data);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.captureOrder = [
            (0, validation_middleware_1.validationMiddleware)(mimoOrder_dto_1.CaptureMimoOrderSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g;
                try {
                    const chargeId = req.params.chargeId; // أو paymentId لو لسه مش عدلته
                    const dto = req.body;
                    // ✅ Debug Logs
                    console.log("🔹 Incoming Capture Request:");
                    console.log("Charge ID:", chargeId);
                    console.log("Body (DTO):", dto);
                    const data = yield this.mimoService.captureOrder(chargeId, dto);
                    res.status(200).json(data);
                }
                catch (err) {
                    console.error("❌ Capture Error:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                    res.status(((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({
                        message: ((_e = (_d = (_c = err.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.messages) === null || _e === void 0 ? void 0 : _e[0]) || err.message || "Unknown error",
                        code: ((_g = (_f = err.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.error_code) || "unknown_error",
                    });
                }
            }),
        ];
        this.refundOrder = [
            (0, validation_middleware_1.validationMiddleware)(mimoOrder_dto_1.RefundMimoOrderSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.mimoService.refundOrder(req.body);
                    res.status(200).json(data);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.getPaymentLink = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const link = yield this.mimoService.getLinkDetails(req.params.linkId);
                res.status(200).json(link);
            }
            catch (err) {
                next(err);
            }
        });
        // public cancelOrder = [
        //   validationMiddleware(CancelMimoOrderSchema, "body"),
        //   async (req: Request, res: Response, next: NextFunction) => {
        //     try {
        //       const data = await this.mimoService.cancelOrder(req.body);
        //       res.status(200).json(data);
        //     } catch (err) {
        //       next(err);
        //     }
        //   },
        // ];
        this.getOrder = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.mimoService.getOrder(req.params.paymentId);
                res.status(200).json(data);
            }
            catch (err) {
                next(err);
            }
        });
    }
};
exports.MimoController = MimoController;
exports.MimoController = MimoController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.MimoService)),
    __metadata("design:paramtypes", [mimoService_1.MimoService])
], MimoController);
