import { inject, injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { FlavorController } from "../controllers/FlavorController";
import { TYPES } from "../../shared/di/types";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateFlavorSchema } from "../../application/dto/CreateFlavor.dto";
import { UpdateFlavorSchema } from "../../application/dto/UpdateFlavor.dto";
import { FilterFlavorSchema } from "../../application/dto/FilterFlavor.dto";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import { flavorUploadMiddleware, processFlavorUploadedFiles } from "../middleware/flavorUpload.middleware";
import multer from "multer";

@injectable()
export class FlavorRoutes {
  public readonly router: Router;

  constructor(
    @inject(TYPES.FlavorController)
    private readonly flavorController: FlavorController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/",
      // authenticateJWT,
      validationMiddleware(FilterFlavorSchema, "query"),
      (req: Request, res: Response, next: NextFunction) =>
        this.flavorController.listFlavors(req, res, next).catch(next)
    );

    this.router.post(
      "/",
      // authenticateJWT,
      flavorUploadMiddleware, // Use new middleware for file uploads
      validationMiddleware(CreateFlavorSchema, "body"),
      (req: Request, res: Response, next: NextFunction) => {
        const imageUrls = processFlavorUploadedFiles(req);
        // Attach file paths to the request body for DTO validation/service processing
        if (imageUrls.front) (req.body as any).frontImage = imageUrls.front;
        if (imageUrls.side) (req.body as any).sideImage = imageUrls.side;
        if (imageUrls.left) (req.body as any).leftImage = imageUrls.left;
        this.flavorController.createFlavor(req, res, next).catch(next);
      }
    );

    this.router.get(
      "/:id",
      // authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.flavorController.getFlavor(req, res, next).catch(next)
    );

    this.router.put(
      "/:id",
      // authenticateJWT,
      flavorUploadMiddleware, // Use new middleware for file uploads
      validationMiddleware(UpdateFlavorSchema, "body"),
      (req: Request, res: Response, next: NextFunction) => {
        const imageUrls = processFlavorUploadedFiles(req);
        if (imageUrls.front) (req.body as any).frontImage = imageUrls.front;
        if (imageUrls.side) (req.body as any).sideImage = imageUrls.side;
        if (imageUrls.left) (req.body as any).leftImage = imageUrls.left;
        this.flavorController.updateFlavor(req, res, next).catch(next);
      }
    );

    this.router.delete(
      "/:id",
      // authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.flavorController.deleteFlavor(req, res, next).catch(next)
    );

    // Existing route for adding single image (might be redundant if using fields upload)
    this.router.post(
      "/:id/images",
      // authenticateJWT,
      multer().none(), 
      (req: Request, res: Response, next: NextFunction) =>
        this.flavorController.addImage(req, res, next).catch(next)
    );

    this.router.delete(
      "/:flavorId/images/:imageId",
      authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.flavorController.removeImage(req, res, next).catch(next)
    );
  }
}
