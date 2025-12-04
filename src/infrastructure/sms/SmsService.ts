import { injectable } from "inversify";
import { Vonage } from "@vonage/server-sdk";
import { Auth } from "@vonage/auth";

@injectable()
export class SmsService {
  private vonage: Vonage;
  private from: string;

  constructor() {
    const apiKey = process.env.VONAGE_API_KEY!;
    const apiSecret = process.env.VONAGE_API_SECRET!;
    const brand = process.env.VONAGE_BRAND_NAME || "YourApp";

    const auth = new Auth({ apiKey, apiSecret });

    this.vonage = new Vonage(auth);

    this.from = brand;
  }

  async sendSms(to: string, text: string): Promise<void> {
    const response = await this.vonage.sms.send({ to, from: this.from, text });

    const msg = response.messages?.[0];
    if (msg && msg.status !== "0") {
      throw new Error(`Vonage SMS error ${msg.status}: ${msg.errorText}`);
    }
  }
}
