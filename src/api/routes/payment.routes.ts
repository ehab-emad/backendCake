import { Router, RequestHandler } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { PaymentController } from "../controllers/PaymentController";
import { authenticateJWT } from "../middleware/AuthMiddleware";

@injectable()
export class PaymentRoutes {
  public readonly router = Router();

  constructor(
    @inject(TYPES.PaymentController) private readonly ctrl: PaymentController
  ) {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post("/", authenticateJWT, ...this.ctrl.create);

    const [listValidator, listHandler] = this.ctrl.list as [
      RequestHandler,
      RequestHandler,
    ];
    this.router.get("/", authenticateJWT, listValidator, listHandler);

    this.router
      .get("/:id", authenticateJWT, this.ctrl.get)
      .put("/:id", authenticateJWT, ...this.ctrl.update)
      .delete("/:id", authenticateJWT, this.ctrl.delete);

    this.router.post(
      "/stripe/session",
      authenticateJWT,
      ...this.ctrl.createStripeSession
    );

    this.router.post("/mamo", authenticateJWT, ...this.ctrl.createMamoPayment);

    this.router.post("/initiate", authenticateJWT, ...this.ctrl.initiatePayment);
  }
}
