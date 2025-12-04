"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TamaraClient = void 0;
const axios_1 = __importDefault(require("axios"));
class TamaraClient {
    constructor() {
        const baseURL = process.env.TAMARA_BASE_URL;
        const token = process.env.TAMARA_API_TOKEN;
        if (!baseURL || !token) {
            throw new Error("Missing TAMARA_BASE_URL or TAMARA_API_TOKEN");
        }
        this.http = axios_1.default.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }
    getPaymentTypes(params) {
        return this.http.get("/checkout/payment-types", { params });
    }
    getCustomerIdVerificationStatus(params) {
        return this.http.get("/merchants/customer/id-verification-status", {
            params,
        });
    }
    createCheckoutSession(body) {
        // return this.http.post("/checkout", body);
        return this.http.post("/orders", body);
    }
    authoriseOrder(orderId) {
        return this.http.post(`/orders/${orderId}/authorise`);
    }
    cancelOrder(orderId, body) {
        return this.http.post(`/orders/${orderId}/cancel`, body);
    }
    captureOrder(body) {
        return this.http.post(`/orders/${body.order_id}/capture`, {
            capture_amount: body.capture_amount,
            shipping_amount: body.shipping_amount,
            tax_amount: body.tax_amount,
            discount_amount: body.discount_amount,
            description: body.description,
        });
    }
    getOrder(orderId) {
        return this.http.get(`/orders/${orderId}`);
    }
    getOrderByReference(referenceId) {
        return this.http.get(`/merchants/orders/reference-id/${referenceId}`);
    }
    updateOrderReference(orderId, body) {
        return this.http.put(`/orders/${orderId}/reference-id`, body);
    }
    simplifiedRefund(orderId, body) {
        return this.http.post(`/payments/simplified-refund/${orderId}`, body);
    }
    registerWebhook(body) {
        return this.http.post("/webhooks", body); // ✅ المصار الصح
    }
    getWebhook(id) {
        return this.http.get(`/webhooks/${id}`);
    }
    deleteWebhook(id) {
        return this.http.delete(`/webhooks/${id}`);
    }
    updateWebhook(id, body) {
        return this.http.put(`/webhooks/${id}`, body);
    }
    listWebhooks() {
        return this.http.get("/webhooks/list");
    }
}
exports.TamaraClient = TamaraClient;
