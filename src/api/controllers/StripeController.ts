import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { validationMiddleware } from "../middleware/validation.middleware";
import { StripeService } from "../../application/services/sripeService";
import {
  CreateStripeOrderDTO,
  CreateStripeOrderSchema,
  RefundStripeOrderDTO,
  RefundStripeOrderSchema,
  CaptureStripeOrderDTO,
  CaptureStripeOrderSchema,
} from "../../application/dto/stripeorder.dto";

import Stripe from "stripe"; // ضروري

@injectable()
export class StripeController {
  constructor(
    @inject(TYPES.StripeService)
    private readonly stripeService: StripeService,
    @inject(TYPES.ClientService)
    private readonly clientService: import("../../application/services/ClientService").ClientService
  ) {}

  public createOrder = [
    validationMiddleware(CreateStripeOrderSchema, "body"),
    async (
      req: Request<unknown, unknown, CreateStripeOrderDTO, unknown>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { checkoutUrl } = await this.stripeService.createOrder(req.body);
        res.status(201).json({ checkoutUrl });
      } catch (err) {
        next(err);
      }
    },
  ];

  public refundOrder = [
    validationMiddleware(RefundStripeOrderSchema, "body"),
    async (
      req: Request<unknown, unknown, RefundStripeOrderDTO, unknown>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        await this.stripeService.refundOrder(req.body);
        res.status(200).json({ message: "Refund processed successfully" });
      } catch (err) {
        console.error("Refund error:", err);
        next(err);
      }
    },
  ];

  public retrieveOrder = [
    async (
      req: Request<{ sessionId: string }>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { sessionId } = req.params;
        const session = await this.stripeService.retrieveOrder(sessionId);
        res.status(200).json(session);
      } catch (err) {
        next(err);
      }
    },
  ];

  public createCustomer = [
    async (
      req: Request<unknown, unknown, { email: string }>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { email } = req.body;
        const customer = await this.stripeService.createCustomer(email);
        res.status(201).json(customer);
      } catch (err) {
        next(err);
      }
    },
  ];

  public captureOrder = [
    validationMiddleware(CaptureStripeOrderSchema, "body"),
    async (
      req: Request<unknown, unknown, CaptureStripeOrderDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        await this.stripeService.captureOrder(req.body);
        res.status(200).json({ message: "Order captured successfully" });
      } catch (err) {
        next(err);
      }
    },
  ];
public handleWebhook = [
  async (req: Request, res: Response, next: NextFunction) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    
    });

    const signature = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !endpointSecret) {
      res.status(400).send("Missing signature or endpoint secret");
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature as string,
        endpointSecret
      );
    } catch (err) {
      console.error("❌ Webhook Error:", err);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;
          console.log("[STRIPE] Webhook event type:", event.type);
          console.log("[STRIPE] Full session object:", JSON.stringify(session, null, 2));
          console.log("[STRIPE] Session metadata:", session.metadata);
          const clientId = session.metadata?.clientId;
          console.log("[STRIPE] Extracted clientId:", clientId);
          if (clientId) {
            await this.clientService.updateClient(clientId, { subscriptionType: "paid" });
            console.log(`[STRIPE] ✅ Client ${clientId} subscription updated to paid`);
          } else {
            console.warn("[STRIPE] ⚠️ No clientId found in session metadata");
          }
          break;

        case "payment_intent.succeeded":
          const payment = event.data.object as Stripe.PaymentIntent;
          console.log("✅ Payment succeeded:", payment.id);
          break;

        default:
          console.log(`ℹ️ Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error("❌ Webhook handling failed:", err);
      next(err);
    }
  },
];

}
