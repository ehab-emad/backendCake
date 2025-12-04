import { inject, injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { MaskController } from "../controllers/MaskController";
import { TYPES } from "../../shared/di/types";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateMaskSchema } from "../../application/dto/CreateMask.dto";
import { UpdateMaskSchema } from "../../application/dto/UpdateMask.dto";
import { FilterMaskSchema } from "../../application/dto/FilterMask.dto";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import { maskUploadMiddleware, processMaskUploadedFiles } from "../middleware/maskUpload.middleware";
import multer from "multer";

@injectable()
export class MaskRoutes {
  public readonly router: Router;

  constructor(
    @inject(TYPES.MaskController)
    private readonly maskController: MaskController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/",
      // authenticateJWT,
      validationMiddleware(FilterMaskSchema, "query"),
      (req: Request, res: Response, next: NextFunction) =>
        this.maskController.listMasks(req, res, next).catch(next)
    );

    this.router.post(
      "/",
      // authenticateJWT,
      maskUploadMiddleware, // Use new middleware for file uploads
      validationMiddleware(CreateMaskSchema, "body"),
      (req: Request, res: Response, next: NextFunction) => {
        const imageUrls = processMaskUploadedFiles(req);
        // Attach file paths to the request body for DTO validation/service processing
        if (imageUrls.front) (req.body as any).frontImage = imageUrls.front;
        if (imageUrls.side) (req.body as any).sideImage = imageUrls.side;
        if (imageUrls.left) (req.body as any).leftImage = imageUrls.left;
        this.maskController.createMask(req, res, next).catch(next);
      }
    );

    this.router.get(
      "/:id",
      // authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.maskController.getMask(req, res, next).catch(next)
    );

    this.router.put(
      "/:id",
      // authenticateJWT,
      maskUploadMiddleware, // Use new middleware for file uploads
      validationMiddleware(UpdateMaskSchema, "body"),
      (req: Request, res: Response, next: NextFunction) => {
        const imageUrls = processMaskUploadedFiles(req);
        if (imageUrls.front) (req.body as any).frontImage = imageUrls.front;
        if (imageUrls.side) (req.body as any).sideImage = imageUrls.side;
        if (imageUrls.left) (req.body as any).leftImage = imageUrls.left;
        this.maskController.updateMask(req, res, next).catch(next);
      }
    );

    this.router.delete(
      "/:id",
      // authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.maskController.deleteMask(req, res, next).catch(next)
    );

    // The separate addImage route is now redundant as file uploads are handled in POST and PUT
    // this.router.post(
    //   "/:id/images",
    //   // authenticateJWT,
    //   multer().none(), 
    //   (req: Request, res: Response, next: NextFunction) =>
    //     this.maskController.addImage(req, res, next).catch(next)
    // );

    this.router.delete(
      "/:maskId/images/:imageId",
      authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.maskController.removeImage(req, res, next).catch(next)
    );
  }
}
