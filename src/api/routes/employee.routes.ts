import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { injectable, inject } from "inversify";
import { EmployeeController } from "../controllers/EmployeeController";
import { TYPES } from "../../shared/di/types";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
  CreateEmployeeSchema,
  CreateEmployeeDTO,
} from "../../application/dto/CreateEmployee.dto";
import {
  UpdateEmployeeSchema,
  UpdateEmployeeDTO,
} from "../../application/dto/UpdateEmployee.dto";
import { authenticateJWT } from "../middleware/AuthMiddleware";

@injectable()
export class EmployeeRoutes {
  public readonly router = Router();

  private readonly upload = multer({ dest: "uploads/employees/" }).fields([
    { name: "profileImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]);

  constructor(
    @inject(TYPES.EmployeeController)
    private readonly controller: EmployeeController
  ) {
    this.router.post(
      "/",
      authenticateJWT,
      this.upload,
      validationMiddleware(CreateEmployeeSchema),
      (req: Request, res: Response, next: NextFunction) => {
        const files = req.files as
          | Record<string, Express.Multer.File[]>
          | undefined;
        const dto = req.body as CreateEmployeeDTO;

        if (files?.profileImage?.[0]) {
          dto.profileImage = files.profileImage[0].path;
        }
        if (files?.images?.length) {
          dto.images = files.images.map((f) => f.path);
        }

        this.controller.createEmployee(req, res, next).catch(next);
      }
    );

    // this.router.get(
    //   "/",
    //   authenticateJWT,
    //   (req: Request, res: Response, next: NextFunction) =>
    //     this.controller.listEmployees(req, res, next).catch(next)
    // );

    this.router.get(
      "/:id",
      authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.controller.getEmployee(req, res, next).catch(next)
    );

    this.router.put(
      "/:id",
      authenticateJWT,
      this.upload,
      validationMiddleware(UpdateEmployeeSchema),
      (req: Request, res: Response, next: NextFunction) => {
        const files = req.files as
          | Record<string, Express.Multer.File[]>
          | undefined;
        const dto = req.body as UpdateEmployeeDTO;

        if (files?.profileImage?.[0]) {
          dto.profileImage = files.profileImage[0].path;
        }
        if (files?.images?.length) {
          dto.newImages = files.images.map((f) => f.path);
        }

        this.controller.updateEmployee(req, res, next).catch(next);
      }
    );

    this.router.delete(
      "/:id",
      authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.controller.deleteEmployee(req, res, next).catch(next)
    );

    this.router.delete(
      "/:id/images/:imageId",
      authenticateJWT,
      (req: Request, res: Response, next: NextFunction) =>
        this.controller.removeImage(req, res, next).catch(next)
    );
  }
}
