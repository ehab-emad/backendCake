import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { SummaryService } from "../../application/services/SummaryService";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
  SummaryFilterSchema,
  SummaryFilterDTO,
} from "../../application/dto/SummaryFilter.dto";

@injectable()
export class SummaryController {
  constructor(@inject(TYPES.SummaryService) private svc: SummaryService) {}

  public get = [
    validationMiddleware(SummaryFilterSchema, "query"),

    async (
      req: Request<unknown, unknown, unknown, SummaryFilterDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const filters = SummaryFilterSchema.parse(req.query);
        const data = await this.svc.getSummary(filters);
        res.json(data);
      } catch (err) {
        next(err);
      }
    },
  ];
}
