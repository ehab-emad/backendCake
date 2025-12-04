import { inject, injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { ShapeController } from "../controllers/ShapeController";
import { TYPES } from "../../shared/di/types";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateShapeSchema } from "../../application/dto/CreateShape.dto";
import { UpdateShapeSchema } from "../../application/dto/UpdateShape.dto";
import { FilterShapeSchema } from "../../application/dto/FilterShape.dto";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import { shapeUploadMiddleware, processShapeUploadedFiles } from "../middleware/shapeUpload.middleware";
import multer from "multer";

@injectable()
export class ShapeRoutes {
  public readonly router: Router;

  constructor(
    @inject(TYPES.ShapeController)
    private readonly shapeController: ShapeController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/",
      // authenticateJWT,
      validationMiddleware(FilterShapeSchema, "query"),
      (req: Request, res: Response, next: NextFunction) =>
        this.shapeController.listShapes(req, res, next).catch(next)
    );

    this.router.post(
      "/",
      // authenticateJWT,
      shapeUploadMiddleware, // Use new middleware for file uploads
      validationMiddleware(CreateShapeSchema, "body"),
      (req: Request, res: Response, next: NextFunction) => {
        const imageUrls = processShapeUploadedFiles(req);
        // Attach file paths to the request body for DTO validation/service processing
        if (imageUrls.front) (req.body as any).frontImage = imageUrls.front;
        if (imageUrls.side) (req.body as any).sideImage = imageUrls.side;
        if (imageUrls.left) (req.body as any).leftImage = imageUrls.left;
        this.shapeController.createShape(req, res, next).catch(next);
      }
    );

    this.router.get(
      "/:id",
      // authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.shapeController.getShape(req, res, next).catch(next)
    );

    this.router.put(
      "/:id",
      // authenticateJWT,
      shapeUploadMiddleware, // Use new middleware for file uploads
      validationMiddleware(UpdateShapeSchema, "body"),
      (req: Request, res: Response, next: NextFunction) => {
        const imageUrls = processShapeUploadedFiles(req);
        if (imageUrls.front) (req.body as any).frontImage = imageUrls.front;
        if (imageUrls.side) (req.body as any).sideImage = imageUrls.side;
        if (imageUrls.left) (req.body as any).leftImage = imageUrls.left;
        this.shapeController.updateShape(req, res, next).catch(next);
      }
    );

    this.router.delete(
      "/:id",
      // authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.shapeController.deleteShape(req, res, next).catch(next)
    );

    // Existing route for adding single image (might be redundant if using fields upload)
    this.router.post(
      "/:id/images",
      // authenticateJWT,
      multer().none(), 
      (req: Request, res: Response, next: NextFunction) =>
        this.shapeController.addImage(req, res, next).catch(next)
    );

    this.router.delete(
      "/:shapeId/images/:imageId",
      authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.shapeController.removeImage(req, res, next).catch(next)
    );
  }
}
