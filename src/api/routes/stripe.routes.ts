// routes/StripeRoutes.ts

import express, { Router } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import { TamaraWebhookController } from "../controllers/TamaraWebhookController";
import { StripeWebhookController } from "../controllers/sripeWebhook";
import { StripeController } from "../controllers/StripeController";


@injectable()
export class StripeRoutes {
  public readonly router = Router();

  constructor(
    @inject(TYPES.StripeController)
    private readonly ctrl: StripeController
,
     @inject(TYPES.StripeWebhookController)
        private readonly webhookCtrl: StripeWebhookController
      
  ) 
  
  
  
  {
    // إنشاء أوردر
    this.router.post(
      "/stripe/order",
      authenticateJWT,
      ...this.ctrl.createOrder
    );

    // استرجاع الأموال
    this.router.post(
      "/stripe/order/refund",
      authenticateJWT,
      ...this.ctrl.refundOrder
    );

    // جلب بيانات الأوردر باستخدام session ID
    this.router.get(
      "/stripe/order/:sessionId",
      authenticateJWT,
      ...this.ctrl.retrieveOrder
    );

    // إنشاء عميل جديد
    this.router.post(
      "/stripe/customer",
      authenticateJWT,
      ...this.ctrl.createCustomer
    );

    // كابتشر يدوي للطلب (لو بتستخدم capture_method: "manual")
    this.router.post(
      "/stripe/order/capture",
      authenticateJWT,
      ...this.ctrl.captureOrder
    );

   this.router.post(
       "/stripe/webhook",
       express.raw({ type: 'application/json' }),
       this.webhookCtrl.handleWebhook
     );
  }
}
