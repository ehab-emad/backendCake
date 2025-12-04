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
exports.StripeService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const client_1 = require("../../infrastructure/stripe/client");
let StripeService = class StripeService {
    constructor(cfg) {
        this.cfg = cfg;
        this.client = new client_1.StripeClient();
    }
    createOrder(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.client.createCheckoutSession({
                amount: dto.amount,
                currency: dto.currency,
                customer_email: dto.customerEmail,
                product_name: dto.productName,
                success_url: dto.successUrl,
                cancel_url: dto.cancelUrl,
                metadata: { clientId: dto.clientId },
            });
            return { checkoutUrl: session.data.url };
        });
    }
    refundOrder(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.refundPayment({
                payment_intent: dto.paymentIntent,
                amount: dto.amount,
            });
        });
    }
    captureOrder(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Stripe تلقائيًا بيعمل Capture إلا إذا كنت عامل `capture_method=manual`
            // ولو محتاج تعملها يدوي، ضيفها هنا
            console.log("🚧 Stripe doesn’t require manual capture by default.");
        });
    }
    retrieveOrder(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.retrieveSession(sessionId);
            return response.data;
        });
    }
    createCustomer(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.createCustomer(email);
            return { id: res.data.id };
        });
    }
    getCustomer(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.retrieveCustomer(customerId);
            return res.data;
        });
    }
    registerWebhook(url, events) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.createWebhook({ url, enabled_events: events });
            return res.data.id;
        });
    }
    deleteWebhook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.deleteWebhook(id);
        });
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Config)),
    __metadata("design:paramtypes", [Object])
], StripeService);
