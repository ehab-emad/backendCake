// src/api/routes/MimoRoutes.ts
import express, { Router } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { MimoController } from "../controllers/mimoController";
import { MimoWebhookController } from "../controllers/mimoWebhookController";

@injectable()
export class MimoRoutes {
  public readonly router = Router();

  constructor(
    @inject(TYPES.MimoController)
    private readonly ctrl: MimoController,

    @inject(TYPES.MimoWebhookController)
    private readonly webhookCtrl: MimoWebhookController
  ) {
    // ✅ مسارات الطلبات الأساسية
      this.router.post("/mamo/link", ...this.ctrl.createPaymentLink);
    this.router.get("/mamo/link/:linkId", this.ctrl.getPaymentLink);
      this.router.post("/mimo/charge", ...this.ctrl.createOrder);
this.router.post("/capture/:chargeId", ...this.ctrl.captureOrder);


    this.router.post("/mimo/charge/refund", ...this.ctrl.refundOrder);
    this.router.get("/mimo/order/:paymentId", this.ctrl.getOrder);

    // ✅ مسار الويب هوك
    this.router.post(
      "/mimo/webhook",
      express.json(),
      this.webhookCtrl.handleWebhook
    );
  }
}
