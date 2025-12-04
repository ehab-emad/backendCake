import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface PaymentTypesParams {
  country: string;
  phone?: string;
  currency?: string;
  order_value: number;
}

export type JsonObject = Record<string, unknown>;

export class TamaraClient {
  private readonly http: AxiosInstance;

  constructor() {
    const baseURL = process.env.TAMARA_BASE_URL;
    const token = process.env.TAMARA_API_TOKEN;
    if (!baseURL || !token) {
      throw new Error("Missing TAMARA_BASE_URL or TAMARA_API_TOKEN");
    }
    this.http = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getPaymentTypes(params: PaymentTypesParams): Promise<AxiosResponse<unknown>> {
    return this.http.get("/checkout/payment-types", { params });
  }

  getCustomerIdVerificationStatus(params: {
    phone_number: string;
    country_code: string;
  }): Promise<AxiosResponse<unknown>> {
    return this.http.get("/merchants/customer/id-verification-status", {
      params,
    });
  }

  createCheckoutSession(body: JsonObject): Promise<AxiosResponse<unknown>> {
    // return this.http.post("/checkout", body);
     return this.http.post("/orders", body);
  }

  authoriseOrder(orderId: string): Promise<AxiosResponse<unknown>> {
    return this.http.post(`/orders/${orderId}/authorise`);
  }

  
  cancelOrder(
    orderId: string,
    body: JsonObject
  ): Promise<AxiosResponse<unknown>> {
    return this.http.post(`/orders/${orderId}/cancel`, body);
  }
captureOrder(body: {
  order_id: string;
  capture_amount: { amount: number; currency: string };
  shipping_amount?: { amount: number; currency: string };
  tax_amount?: { amount: number; currency: string };
  discount_amount?: { amount: number; currency: string };
  description?: string;
}): Promise<AxiosResponse<unknown>> {
  return this.http.post(`/orders/${body.order_id}/capture`, {
    capture_amount: body.capture_amount,
    shipping_amount: body.shipping_amount,
    tax_amount: body.tax_amount,
    discount_amount: body.discount_amount,
    description: body.description,
  });
}






  getOrder(orderId: string): Promise<AxiosResponse<unknown>> {
    return this.http.get(`/orders/${orderId}`);
  }

  getOrderByReference(referenceId: string): Promise<AxiosResponse<unknown>> {
    return this.http.get(`/merchants/orders/reference-id/${referenceId}`);
  }

  updateOrderReference(
    orderId: string,
    body: { order_reference_id: string }
  ): Promise<AxiosResponse<unknown>> {
    return this.http.put(`/orders/${orderId}/reference-id`, body);
  }

  simplifiedRefund(
    orderId: string,
    body: JsonObject
  ): Promise<AxiosResponse<unknown>> {
    return this.http.post(`/payments/simplified-refund/${orderId}`, body);
  }

  registerWebhook(body: JsonObject): Promise<AxiosResponse<unknown>> {
  return this.http.post("/webhooks", body); // ✅ المصار الصح

  }

  getWebhook(id: string): Promise<AxiosResponse<unknown>> {
    return this.http.get(`/webhooks/${id}`);
  }

  deleteWebhook(id: string): Promise<AxiosResponse<unknown>> {
    return this.http.delete(`/webhooks/${id}`);
  }

  updateWebhook(id: string, body: JsonObject): Promise<AxiosResponse<unknown>> {
    return this.http.put(`/webhooks/${id}`, body);
  }

  listWebhooks(): Promise<AxiosResponse<unknown>> {
    return this.http.get("/webhooks/list");
  }
}
