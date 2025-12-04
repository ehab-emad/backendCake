"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.MimoService = void 0;
// src/application/services/MimoService.ts
const inversify_1 = require("inversify");
const client_1 = require("../../infrastructure/mimo/client");
let MimoService = class MimoService {
    constructor() {
        this.client = new client_1.MimoClient();
    }
    createOrder(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const payload = dto;
            console.log("🔍 Payload being sent to Mamo:", JSON.stringify(payload, null, 2));
            try {
                const res = yield this.client.createCharge(payload);
                return res.data;
            }
            catch (error) {
                console.error("❌ ERROR STATUS:", (_a = error.response) === null || _a === void 0 ? void 0 : _a.status);
                console.error("❌ ERROR DATA:", JSON.stringify((_b = error.response) === null || _b === void 0 ? void 0 : _b.data, null, 2));
                console.error("❌ FULL ERROR:", (_c = error.toJSON) === null || _c === void 0 ? void 0 : _c.call(error));
                console.dir(error, { depth: null });
                throw error;
            }
        });
    }
    captureOrder(chargeId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield this.client.captureCharge(chargeId, {
                    amount: dto.amount,
                });
                return res.data;
            }
            catch (err) {
                console.error("❌ Error from Mamo API:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                throw err; // خليه يترمي للكنترولر
            }
        });
    }
    refundOrder(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.refundCharge(dto.paymentId, {
                amount: dto.amount,
                reason: dto.reason,
            });
            return res.data;
        });
    }
    //   async cancelOrder(dto: CancelMimoOrderDTO) {
    //     const res = await this.client.cancelPayment(dto.paymentId, {
    //       reason: dto.reason,
    //     });
    //     return res.data;
    //   }
    createPaymentLink(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.createLink(dto);
            return res.data;
        });
    }
    getLinkDetails(linkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.getLink(linkId);
            return res.data;
        });
    }
    getOrder(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.getPayment(paymentId);
            return res.data;
        });
    }
};
exports.MimoService = MimoService;
exports.MimoService = MimoService = __decorate([
    (0, inversify_1.injectable)()
], MimoService);
