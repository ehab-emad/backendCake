import { Router, RequestHandler } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { CustomerController } from "../controllers/CustomerController";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import multer from "multer";
import path from "path";

@injectable()
export class CustomerRoutes {
  public readonly router = Router();

  private readonly storage = multer.diskStorage({
    destination: "uploads/customers/profile-pictures/",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, 'profile-' + uniqueSuffix + ext);
    },
  });

  private readonly upload = multer({
    storage: this.storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
      }
    },
  }).single('profilePicture');

  constructor(
    @inject(TYPES.CustomerController)
    private readonly ctrl: CustomerController
  ) {
    this.router.post(
      "/",
      authenticateJWT,
      (req, res, next) => {
        this.upload(req, res, (err: any) => {
          if (err) {
            return res.status(400).json({ error: err.message });
          }
          next();
        });
      },
      ...(this.ctrl.create as RequestHandler[])
    );

    this.router.put(
      "/:customerId",
      authenticateJWT,
      (req, res, next) => {
        this.upload(req, res, (err: any) => {
          if (err) {
            return res.status(400).json({ error: err.message });
          }
          next();
        });
      },
      ...(this.ctrl.update as RequestHandler[])
    );

    this.router.get(
      "/:customerId",
      authenticateJWT,
      ...(this.ctrl.getById as RequestHandler[])
    );

    this.router.get(
      "/auth/:authUserId",
      authenticateJWT,
      ...(this.ctrl.getByAuthUser as RequestHandler[])
    );

    this.router.get(
      "/",
      authenticateJWT,
      ...(this.ctrl.list as RequestHandler[])
    );

    this.router.patch(
      "/:customerId/vip",
      authenticateJWT,
      ...(this.ctrl.upgradeToVIP as RequestHandler[])
    );

    this.router.delete(
      "/:customerId",
      authenticateJWT,
      ...(this.ctrl.delete as RequestHandler[])
    );

    // Routes للمفضلة (Favorites)
    this.router.post(
      "/:customerId/favorites",
      authenticateJWT,
      ...(this.ctrl.addToFavorites as RequestHandler[])
    );

    this.router.delete(
      "/:customerId/favorites",
      authenticateJWT,
      ...(this.ctrl.removeFromFavorites as RequestHandler[])
    );

    this.router.get(
      "/:customerId/favorites",
      authenticateJWT,
      ...(this.ctrl.getFavorites as RequestHandler[])
    );

    this.router.post(
      "/:customerId/favorites/check",
      authenticateJWT,
      ...(this.ctrl.isFavorite as RequestHandler[])
    );

    this.router.delete(
      "/:customerId/favorites/all",
      authenticateJWT,
      ...(this.ctrl.clearFavorites as RequestHandler[])
    );
  }
}
