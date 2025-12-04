import { Request, Response, NextFunction, RequestHandler } from "express";
import { injectable, inject } from "inversify";
import {
  RegisterDeviceTokenSchema,
  RegisterDeviceTokenDTO,
} from "../../application/dto/RegisterDeviceToken.dto";
import { validationMiddleware } from "../middleware/validation.middleware";
import { IDeviceTokenRepository } from "../../core/interfaces/repositories/IDeviceTokenRepository";
import { AuthUser } from "../../core/entities/Auth";
import { TYPES } from "../../shared/di/types";

@injectable()
export class DeviceTokenController {
  constructor(
    @inject(TYPES.DeviceTokenRepository)
    private readonly repo: IDeviceTokenRepository
  ) {}

  public register: RequestHandler[] = [
    validationMiddleware(RegisterDeviceTokenSchema, "body"),

    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const r = req as Request & {
          user: AuthUser;
          body: RegisterDeviceTokenDTO;
        };

        const { token } = r.body;
        const userId = r.user.id;

        await this.repo.addOrUpdate(userId, token);
        res.sendStatus(204);
      } catch (err) {
        next(err);
      }
    },
  ];
}
