import { Router } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { SummaryController } from "../controllers/SummaryController";
import { authenticateJWT } from "../middleware/AuthMiddleware";

@injectable()
export class SummaryRoutes {
  public readonly router = Router();

  constructor(
    @inject(TYPES.SummaryController) private ctrl: SummaryController
  ) {
    this.router.get("/", authenticateJWT, ...this.ctrl.get);
  }
}
