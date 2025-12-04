import { Router } from "express";
import { injectable, inject } from "inversify";
import { upload } from "../../shared/upload";
import { validationMiddleware } from "../middleware/validation.middleware";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import { TYPES } from "../../shared/di/types";
import { ClientController } from "../controllers/ClientController";
import { CreateClientSchema } from "../../application/dto/CreateClient.dto";
import { UpdateClientSchema } from "../../application/dto/UpdateClient.dto";

@injectable()
export class ClientRoutes {
  public readonly router = Router();

  constructor(
    @inject(TYPES.ClientController)
    private readonly ctrl: ClientController
  ) {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.get("/", this.ctrl.list);

    this.router.get("/:id", this.ctrl.get);

    this.router.post(
      "/",
      authenticateJWT,
      upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "attachments", maxCount: 10 },
      ]),
      validationMiddleware(CreateClientSchema),
      this.ctrl.create
    );

    this.router.put(
      "/:id",
      authenticateJWT,
      upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "attachments", maxCount: 10 },
      ]),
      validationMiddleware(UpdateClientSchema),
      this.ctrl.update
    );

    this.router.delete("/:id", authenticateJWT, this.ctrl.delete);

    this.router.get(
      "/:id/attachments",
      authenticateJWT,
      this.ctrl.listAttachments
    );

    this.router.post(
      "/:id/attachments",
      authenticateJWT,
      upload.single("attachment"),
      this.ctrl.addAttachment
    );

    this.router.delete(
      "/:id/attachments/:attachmentId",
      authenticateJWT,
      this.ctrl.removeAttachmentById
    );
  }
}
