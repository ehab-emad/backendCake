import { Router, RequestHandler } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { ReservationController } from "../controllers/ReservationController";
import { authenticateJWT } from "../middleware/AuthMiddleware";

@injectable()
export class ReservationRoutes {
  public readonly router = Router();

  constructor(
    @inject(TYPES.ReservationController)
    private readonly ctrl: ReservationController
  ) {
    this.router.post(
      "/",
      authenticateJWT,
      ...(this.ctrl.create as RequestHandler[])
    );

    this.router.get("/", ...(this.ctrl.list as RequestHandler[]));

    this.router.get("/:id", authenticateJWT, this.ctrl.get);
    this.router.put(
      "/:_id",
      authenticateJWT,
      ...(this.ctrl.update as RequestHandler[])
    );
    this.router.delete("/:_id", authenticateJWT, this.ctrl.delete);
    
    // Payment webhook endpoint (no auth as it's called by payment providers)
    this.router.post(
      "/webhooks/:gateway",
      this.ctrl.handlePaymentWebhook as RequestHandler
    );

    // Cancel reservation endpoint
    this.router.post(
      "/:id/cancel",
      authenticateJWT,
      this.ctrl.cancelReservation as RequestHandler
    );
    
    // Add other payment-related routes here if needed
  }
}
