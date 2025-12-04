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
exports.StripeClient = void 0;
// stripe.client.ts
const axios_1 = __importDefault(require("axios"));
class StripeClient {
    constructor() {
        const baseURL = "https://api.stripe.com/v1";
        const token = process.env.STRIPE_SECRET_KEY;
        if (!token) {
            throw new Error("Missing STRIPE_SECRET_KEY");
        }
        this.http = axios_1.default.create({
            baseURL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${token}`,
            },
        });
    }
    createCheckoutSession(body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // اطبع body القادم
            console.log("Checkout session body:", JSON.stringify(body));
            const params = new URLSearchParams();
            params.append("payment_method_types[0]", "card");
            params.append("line_items[0][price_data][currency]", body.currency.toLowerCase());
            params.append("line_items[0][price_data][unit_amount]", body.amount.toString());
            params.append("line_items[0][price_data][product_data][name]", body.product_name || "Product");
            params.append("line_items[0][quantity]", "1");
            params.append("mode", "payment");
            params.append("success_url", body.success_url);
            params.append("cancel_url", body.cancel_url);
            params.append("customer_email", body.customer_email);
            if ((_a = body.metadata) === null || _a === void 0 ? void 0 : _a.clientId) {
                params.append("metadata[clientId]", body.metadata.clientId);
            }
            // اطبع كل الـ params قبل الإرسال
            console.log("Stripe params:", params.toString());
            try {
                return yield this.http.post("/checkout/sessions", params);
            }
            catch (error) {
                if (error.response) {
                    console.error("[STRIPE] Error status:", error.response.status);
                    console.error("[STRIPE] Error headers:", error.response.headers);
                    console.error("[STRIPE] Error data:", error.response.data);
                    console.error("[STRIPE] Error config:", error.config);
                }
                else {
                    console.error("[STRIPE] Error:", error.message);
                    console.error("[STRIPE] Error config:", error.config);
                }
                throw error;
            }
        });
    }
    retrieveSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.http.get(`/checkout/sessions/${sessionId}`);
        });
    }
    createCustomer(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams();
            params.append("email", email);
            return this.http.post("/customers", params);
        });
    }
    retrieveCustomer(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.http.get(`/customers/${customerId}`);
        });
    }
    refundPayment(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams();
            params.append("payment_intent", body.payment_intent);
            if (body.amount)
                params.append("amount", body.amount.toString());
            return this.http.post("/refunds", params);
        });
    }
    retrievePaymentIntent(intentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.http.get(`/payment_intents/${intentId}`);
        });
    }
    // ✅ إنشاء Webhook جديد
    createWebhook(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams();
            params.append("url", body.url);
            body.enabled_events.forEach((event, i) => params.append(`enabled_events[${i}]`, event));
            return this.http.post("/webhook_endpoints", params);
        });
    }
    // ✅ جلب كل الـ Webhooks
    listWebhooks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.http.get("/webhook_endpoints");
        });
    }
    // ✅ حذف Webhook
    deleteWebhook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.http.delete(`/webhook_endpoints/${id}`);
        });
    }
    // ✅ جلب Webhook معين
    retrieveWebhook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.http.get(`/webhook_endpoints/${id}`);
        });
    }
    // ✅ تعديل Webhook
    updateWebhook(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams();
            if (body.url)
                params.append("url", body.url);
            if (body.enabled_events) {
                body.enabled_events.forEach((event, i) => params.append(`enabled_events[${i}]`, event));
            }
            return this.http.post(`/webhook_endpoints/${id}`, params);
        });
    }
}
exports.StripeClient = StripeClient;
