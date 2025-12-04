// src/api/controllers/MimoWebhookController.ts

import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { ReservationPaymentService } from "../../application/services/ReservationPaymentService";

@injectable()
export class MimoWebhookController {
  constructor(
    @inject(TYPES.ReservationPaymentService)
    private readonly reservationPaymentService: ReservationPaymentService
  ) {}

  public handleWebhook = async (req: Request, res: Response) => {
    try {
      console.log("📩 Webhook received from Mimo:", JSON.stringify(req.body, null, 2));

      // Process the webhook through ReservationPaymentService
      await this.reservationPaymentService.handlePaymentWebhook('mimo', req.body);

      // Send success response
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("❌ Error processing Mimo webhook:", error);
      res.status(500).json({
        error: "Failed to process webhook",
        message: error.message
      });
    }
  };
}
