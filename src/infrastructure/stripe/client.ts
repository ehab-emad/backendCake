// stripe.client.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface CreateCheckoutSessionParams {
  amount: number;
  currency: string;
  customer_email: string;
  success_url: string;
  cancel_url: string;
  product_name?: string;
  metadata?: { clientId: string };
}

export interface RefundParams {
  payment_intent: string;
  amount?: number;
}

export class StripeClient {
  private readonly http: AxiosInstance;

  constructor() {
    const baseURL = "https://api.stripe.com/v1";
    const token = process.env.STRIPE_SECRET_KEY;
    if (!token) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }
    this.http = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createCheckoutSession(body: CreateCheckoutSessionParams): Promise<AxiosResponse<unknown>> {
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
    if (body.metadata?.clientId) {
      params.append("metadata[clientId]", body.metadata.clientId);
    }

    // اطبع كل الـ params قبل الإرسال
    console.log("Stripe params:", params.toString());
    try {
    return await this.http.post("/checkout/sessions", params);
  } catch (error: any) {
    if (error.response) {
      console.error("[STRIPE] Error status:", error.response.status);
      console.error("[STRIPE] Error headers:", error.response.headers);
      console.error("[STRIPE] Error data:", error.response.data);
      console.error("[STRIPE] Error config:", error.config);
    } else {
      console.error("[STRIPE] Error:", error.message);
      console.error("[STRIPE] Error config:", error.config);
    }
    throw error;
  }
  }

  async retrieveSession(sessionId: string): Promise<AxiosResponse<unknown>> {
    return this.http.get(`/checkout/sessions/${sessionId}`);
  }

  async createCustomer(email: string): Promise<AxiosResponse<unknown>> {
    const params = new URLSearchParams();
    params.append("email", email);
    return this.http.post("/customers", params);
  }

  async retrieveCustomer(customerId: string): Promise<AxiosResponse<unknown>> {
    return this.http.get(`/customers/${customerId}`);
  }

  async refundPayment(body: RefundParams): Promise<AxiosResponse<unknown>> {
    const params = new URLSearchParams();
    params.append("payment_intent", body.payment_intent);
    if (body.amount) params.append("amount", body.amount.toString());
    return this.http.post("/refunds", params);
  }

  async retrievePaymentIntent(intentId: string): Promise<AxiosResponse<unknown>> {
    return this.http.get(`/payment_intents/${intentId}`);
  }

  
  // ✅ إنشاء Webhook جديد
  async createWebhook(body: {
    url: string;
    enabled_events: string[];
  }): Promise<AxiosResponse<unknown>> {
    const params = new URLSearchParams();
    params.append("url", body.url);
    body.enabled_events.forEach((event, i) =>
      params.append(`enabled_events[${i}]`, event)
    );
    return this.http.post("/webhook_endpoints", params);
  }

  // ✅ جلب كل الـ Webhooks
  async listWebhooks(): Promise<AxiosResponse<unknown>> {
    return this.http.get("/webhook_endpoints");
  }

  // ✅ حذف Webhook
  async deleteWebhook(id: string): Promise<AxiosResponse<unknown>> {
    return this.http.delete(`/webhook_endpoints/${id}`);
  }

  // ✅ جلب Webhook معين
  async retrieveWebhook(id: string): Promise<AxiosResponse<unknown>> {
    return this.http.get(`/webhook_endpoints/${id}`);
  }

  // ✅ تعديل Webhook
  async updateWebhook(id: string, body: {
    url?: string;
    enabled_events?: string[];
  }): Promise<AxiosResponse<unknown>> {
    const params = new URLSearchParams();
    if (body.url) params.append("url", body.url);
    if (body.enabled_events) {
      body.enabled_events.forEach((event, i) =>
        params.append(`enabled_events[${i}]`, event)
      );
    }
    return this.http.post(`/webhook_endpoints/${id}`, params);
  }

}
