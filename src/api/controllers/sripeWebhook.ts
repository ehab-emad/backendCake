// src/interfaces/controllers/StripeWebhookController.ts
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import ReservationPaymentService from "../../application/services/ReservationPaymentService";
import Stripe from "stripe";

@injectable()
export class StripeWebhookController {
  constructor(
    @inject(TYPES.ReservationPaymentService)
    private readonly reservationPaymentService: ReservationPaymentService
  ) {}

  public handleWebhook = async (req: Request, res: Response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const signature = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
      console.error("❌ Missing Stripe signature header");
      res.status(400).json({ error: "Missing Stripe signature" });
      return;
    }

    if (!endpointSecret) {
      console.error("❌ Missing Stripe webhook secret in environment");
      res.status(500).json({ error: "Server misconfiguration" });
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature as string,
        endpointSecret
      );
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const eventType = event.type;
    const eventData = event.data.object as any;

    console.log("📩 Stripe Webhook received:", eventType);

    try {
      // Use ReservationPaymentService to handle the webhook
      await this.reservationPaymentService.handlePaymentWebhook('stripe', event);

      console.log("✅ Stripe webhook processed successfully");
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("❌ Error processing Stripe webhook:", error);
      res.status(500).json({ error: "Error processing webhook" });
    }
  };
}
