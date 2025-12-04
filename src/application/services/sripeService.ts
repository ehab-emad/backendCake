import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { StripeClient } from "../../infrastructure/stripe/client";

import { IAppConfig } from "../../core/config/IAppConfig";
import { CaptureStripeOrderDTO, CreateStripeOrderDTO, RefundStripeOrderDTO } from "../dto/stripeorder.dto";

@injectable()
export class StripeService {
  private readonly client: StripeClient;

  constructor(@inject(TYPES.Config) private cfg: IAppConfig) {
    this.client = new StripeClient();
  }

  public async createOrder(dto: CreateStripeOrderDTO): Promise<{ checkoutUrl: string }> {
    const session = await this.client.createCheckoutSession({
      amount: dto.amount,
      currency: dto.currency,
      customer_email: dto.customerEmail,
      product_name: dto.productName,
      success_url: dto.successUrl,
      cancel_url: dto.cancelUrl,
      metadata: { clientId: dto.clientId },
    });

    return { checkoutUrl: (session.data as any).url };
  }

  public async refundOrder(dto: RefundStripeOrderDTO): Promise<void> {
    await this.client.refundPayment({
      payment_intent: dto.paymentIntent,
      amount: dto.amount,
    });
  }

  public async captureOrder(dto: CaptureStripeOrderDTO): Promise<void> {
    // Stripe تلقائيًا بيعمل Capture إلا إذا كنت عامل `capture_method=manual`
    // ولو محتاج تعملها يدوي، ضيفها هنا
    console.log("🚧 Stripe doesn’t require manual capture by default.");
  }

  public async retrieveOrder(sessionId: string): Promise<unknown> {
    const response = await this.client.retrieveSession(sessionId);
    return response.data;
  }

  public async createCustomer(email: string): Promise<{ id: string }> {
    const res = await this.client.createCustomer(email);
    return { id: (res.data as any).id };
  }

  public async getCustomer(customerId: string): Promise<unknown> {
    const res = await this.client.retrieveCustomer(customerId);
    return res.data;
  }

  public async registerWebhook(url: string, events: string[]): Promise<string> {
    const res = await this.client.createWebhook({ url, enabled_events: events });
    return (res.data as any).id;
  }

  public async deleteWebhook(id: string): Promise<void> {
    await this.client.deleteWebhook(id);
  }
}
