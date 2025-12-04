import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { container } from "../../shared/di/container";
import { TYPES } from "../../shared/di/types";
import { AuthController } from "../controllers/AuthController";
import { authenticateJWT } from "../middleware/AuthMiddleware";

const router = express.Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.register(req, res);
    } catch (err) {
      next(err);
    }
  }
);



router.post(
  "/google/native",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.googleAuthNative(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.login(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/otp", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authController.otp(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.delete(
  "/:userId",
  authenticateJWT,
  ...(authController.delete as RequestHandler[])
);

router.get("/google", authController.googleAuth());
router.get("/google/callback", authController.googleAuthCallback());

router.get("/profile", authenticateJWT, (req: Request, res: Response) => {
  res.json(req.user);
});

router.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.refresh(req, res);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
