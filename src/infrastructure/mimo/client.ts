// src/infrastructure/mimo/client.ts
import axios, { AxiosInstance } from "axios";

export class MimoClient {
  private readonly http: AxiosInstance;

  constructor() {
    const baseURL = process.env.MAMO_BASE_URL!;
    const apiKey =  process.env.MAMO_API_KEY!;

    this.http = axios.create({
      baseURL,
      
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }
createCharge(data: any) {
    return this.http.post("/manage_api/v1/charges", data); // تنفيذ عملية دفع
  }

  getChargesList() {
    return this.http.get("/manage_api/v1/charges"); // جلب قائمة العمليات
  }

  getChargeDetails(chargeId: string) {
    return this.http.get(`/manage_api/v1/charges/${chargeId}`); // تفاصيل عملية واحدة
  }

  refundCharge(chargeId: string, data: any) {
    return this.http.post(`/manage_api/v1/charges/${chargeId}/refunds`, data); // عمل refund
  }

  captureCharge(chargeId: string, data: any) {
    return this.http.post(`/manage_api/v1/charges/${chargeId}/captures`, data); // تأكيد خصم
  }

  getPayment(paymentId: string) {
    return this.http.get(`/payments/${paymentId}`);
  }
async createLink(body: any) {
  try {
    const response = await this.http.post("/manage_api/v1/links", body);

    console.log("✅ FULL RESPONSE:");
    console.dir(response, { depth: null }); // ← ده يطبع كل حاجة كويس

    return {
      data: response.data,
      headers: response.headers,
      status: response.status,
    };
  } catch (error: any) {
    console.error("❌ Failed to create Mamo link:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    throw error;
  }
}


  getLink(linkId: string) {
    return this.http.get(`/manage_api/v1/links/${linkId}`);
  }
}
