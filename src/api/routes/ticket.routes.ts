import { Router } from "express";
import { inject, injectable } from "inversify";
import { TicketController } from "../controllers/TicketController";
import { TYPES } from "../../shared/di/types";
import { authenticateJWT } from "../middleware/AuthMiddleware";

@injectable()
export class TicketRoutes {
  public router = Router();

  constructor(@inject(TYPES.TicketController) private ctl: TicketController) {
    this.router.post("/", authenticateJWT, ...this.ctl.create);
    this.router.get("/", authenticateJWT, this.ctl.list);
    this.router.get("/:id", authenticateJWT, this.ctl.get);
    this.router.put("/:id", authenticateJWT, ...this.ctl.update);
    this.router.delete("/:id", authenticateJWT, this.ctl.delete);
  }
}
