// src/interfaces/controllers/TamaraWebhookController.ts
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import ReservationPaymentService from "../../application/services/ReservationPaymentService";

@injectable()
export class TamaraWebhookController {
  constructor(
    @inject(TYPES.ReservationPaymentService)
    private readonly reservationPaymentService: ReservationPaymentService
  ) {}

  public handleWebhook = async (req: Request, res: Response) => {
    try {
      const event = req.body;

      console.log("📩 Webhook received from Tamara:", JSON.stringify(event, null, 2));

      // Use ReservationPaymentService to handle the webhook
      await this.reservationPaymentService.handlePaymentWebhook('tamara', event);

      console.log("✅ Tamara webhook processed successfully");
      res.status(200).json({ message: "Received" });
    } catch (err) {
      console.error("❌ Webhook error:", err);
      res.status(500).json({ message: "Error processing webhook" });
    }
  };
}
