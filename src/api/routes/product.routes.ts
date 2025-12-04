import { inject, injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { ProductController } from "../controllers/ProductController";
import { TYPES } from "../../shared/di/types";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateProductSchema } from "../../application/dto/CreateProduct.dto";
import { UpdateProductSchema } from "../../application/dto/UpdateProduct.dto";
import { FilterProductSchema } from "../../application/dto/FilterProduct.dto";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import multer from "multer";

@injectable()
export class ProductRoutes {
  public readonly router: Router;

  constructor(
    @inject(TYPES.ProductController)
    private readonly productController: ProductController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/",
      // authenticateJWT,
      validationMiddleware(FilterProductSchema, "query"),
      (req: Request, res: Response, next: NextFunction) =>
        this.productController.listProducts(req, res, next).catch(next)
    );

    this.router.post(
      "/",
      authenticateJWT,
      multer().none(), // Middleware to parse form-data (text fields only)
      validationMiddleware(CreateProductSchema, "body"),
      (req: Request, res: Response, next: NextFunction) =>
        this.productController.createProduct(req, res, next).catch(next)
    );

    this.router.get(
      "/:id",
      // authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.productController.getProduct(req, res, next).catch(next)
    );

    this.router.put(
      "/:id",
      authenticateJWT,
      validationMiddleware(UpdateProductSchema, "body"),
      (req: Request, res: Response, next: NextFunction) =>
        this.productController.updateProduct(req, res, next).catch(next)
    );

    this.router.delete(
      "/:id",
      authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.productController.deleteProduct(req, res, next).catch(next)
    );

    this.router.post(
      "/:id/ratings",
      authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.productController.addRating(req, res, next).catch(next)
    );

    this.router.delete(
      "/:productId/images/:imageId",
      authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.productController.removeImage(req, res, next).catch(next)
    );
  }
}
