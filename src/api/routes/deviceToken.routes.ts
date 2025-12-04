import { Router } from "express";
import { injectable, inject } from "inversify";
import { DeviceTokenController } from "../controllers/DeviceTokenController";
import { TYPES } from "../../shared/di/types";
import { authenticateJWT } from "../middleware/AuthMiddleware";

@injectable()
export class DeviceTokenRoutes {
  public readonly router = Router();

  constructor(
    @inject(TYPES.DeviceTokenController)
    private readonly ctrl: DeviceTokenController
  ) {
    this.router.post("/", authenticateJWT, ...this.ctrl.register);
  }
}
