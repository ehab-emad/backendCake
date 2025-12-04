"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MimoClient = void 0;
// src/infrastructure/mimo/client.ts
const axios_1 = __importDefault(require("axios"));
class MimoClient {
    constructor() {
        const baseURL = process.env.MAMO_BASE_URL;
        const apiKey = process.env.MAMO_API_KEY;
        this.http = axios_1.default.create({
            baseURL,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });
    }
    createCharge(data) {
        return this.http.post("/manage_api/v1/charges", data); // تنفيذ عملية دفع
    }
    getChargesList() {
        return this.http.get("/manage_api/v1/charges"); // جلب قائمة العمليات
    }
    getChargeDetails(chargeId) {
        return this.http.get(`/manage_api/v1/charges/${chargeId}`); // تفاصيل عملية واحدة
    }
    refundCharge(chargeId, data) {
        return this.http.post(`/manage_api/v1/charges/${chargeId}/refunds`, data); // عمل refund
    }
    captureCharge(chargeId, data) {
        return this.http.post(`/manage_api/v1/charges/${chargeId}/captures`, data); // تأكيد خصم
    }
    getPayment(paymentId) {
        return this.http.get(`/payments/${paymentId}`);
    }
    createLink(body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this.http.post("/manage_api/v1/links", body);
                console.log("✅ FULL RESPONSE:");
                console.dir(response, { depth: null }); // ← ده يطبع كل حاجة كويس
                return {
                    data: response.data,
                    headers: response.headers,
                    status: response.status,
                };
            }
            catch (error) {
                console.error("❌ Failed to create Mamo link:");
                console.error("Status:", (_a = error.response) === null || _a === void 0 ? void 0 : _a.status);
                console.error("Data:", (_b = error.response) === null || _b === void 0 ? void 0 : _b.data);
                throw error;
            }
        });
    }
    getLink(linkId) {
        return this.http.get(`/manage_api/v1/links/${linkId}`);
    }
}
exports.MimoClient = MimoClient;
