import express, { Router } from "express"; // ✅ استورد express كمان
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { TamaraController } from "../controllers/TamaraController";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import { TamaraWebhookController } from "../controllers/TamaraWebhookController";

@injectable()
export class TamaraRoutes {
  public readonly router = Router();

  constructor(
    @inject(TYPES.TamaraController)
    private readonly ctrl: TamaraController,

    @inject(TYPES.TamaraWebhookController)
    private readonly webhookCtrl: TamaraWebhookController
  ) {
    this.router.post(
      "/tamara/order",
      authenticateJWT,
      ...this.ctrl.createOrder
    );
    this.router.post(
  "/tamara/order/refund",
  authenticateJWT,
  ...this.ctrl.refundOrder
);

this.router.post(
  "/tamara/order/:orderId/authorise", 
  authenticateJWT,
  this.ctrl.authoriseOrder
);
this.router.post(
  "/tamara/order/:orderId/capture",
  authenticateJWT,
  ...this.ctrl.captureOrder
);





    this.router.post(
  "/tamara/order/cancel",
  authenticateJWT,
  ...this.ctrl.cancelOrder
);


    this.router.post(
      "/tamara/webhook",
      express.json(), // ✅ تم التصحيح
      this.webhookCtrl.handleWebhook
    );
  }
}
