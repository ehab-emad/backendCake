import { inject, injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { FinalProductController } from "../controllers/FinalProductController";
import { TYPES } from "../../shared/di/types";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateFinalProductSchema } from "../../application/dto/CreateFinalProduct.dto";
import { UpdateFinalProductSchema } from "../../application/dto/UpdateFinalProduct.dto";
import { FilterFinalProductSchema } from "../../application/dto/FilterFinalProduct.dto";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import multer from "multer";

@injectable()
export class FinalProductRoutes {
  public readonly router: Router;

  constructor(
    @inject(TYPES.FinalProductController)
    private readonly finalProductController: FinalProductController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/",
      // authenticateJWT,
      validationMiddleware(FilterFinalProductSchema, "query"),
      (req: Request, res: Response, next: NextFunction) =>
        this.finalProductController.listFinalProducts(req, res, next).catch(next)
    );

    this.router.post(
      "/",
      // authenticateJWT,
      multer().none(), // Middleware to parse form-data (text fields only)
      validationMiddleware(CreateFinalProductSchema, "body"),
      (req: Request, res: Response, next: NextFunction) =>
        this.finalProductController.createFinalProduct(req, res, next).catch(next)
    );

    this.router.get(
      "/:id",
      // authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.finalProductController.getFinalProduct(req, res, next).catch(next)
    );

    this.router.put(
      "/:id",
      // authenticateJWT,
      multer().none(), // Middleware to parse form-data (text fields only)
      validationMiddleware(UpdateFinalProductSchema, "body"),
      (req: Request, res: Response, next: NextFunction) =>
        this.finalProductController.updateFinalProduct(req, res, next).catch(next)
    );

    this.router.delete(
      "/:id",
      // authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.finalProductController.deleteFinalProduct(req, res, next).catch(next)
    );
  }
}
