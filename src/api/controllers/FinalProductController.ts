import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { FinalProductService } from "../../application/services/FinalProductService";
import { CreateFinalProductDTO } from "../../application/dto/CreateFinalProduct.dto";
import { UpdateFinalProductDTO } from "../../application/dto/UpdateFinalProduct.dto";
import { FilterFinalProductDTO } from "../../application/dto/FilterFinalProduct.dto";
import { TYPES } from "../../shared/di/types";
import { CreateFinalProductSchema } from "../../application/dto/CreateFinalProduct.dto";
import { UpdateFinalProductSchema } from "../../application/dto/UpdateFinalProduct.dto";
import { FilterFinalProductSchema } from "../../application/dto/FilterFinalProduct.dto";

@injectable()
export class FinalProductController {
  constructor(
    @inject(TYPES.FinalProductService)
    private readonly finalProductService: FinalProductService
  ) {}

  public async listFinalProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = FilterFinalProductSchema.parse(req.query);
      const result = await this.finalProductService.listFinalProducts(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async createFinalProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateFinalProductSchema.parse(req.body);
      const finalProduct = await this.finalProductService.createFinalProduct(dto);
      res.status(201).json(finalProduct);
    } catch (error) {
      next(error);
    }
  }

  public async getFinalProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const finalProduct = await this.finalProductService.getFinalProduct(req.params.id);
      res.json(finalProduct);
    } catch (error) {
      next(error);
    }
  }

  public async updateFinalProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = UpdateFinalProductSchema.parse(req.body);
      const finalProduct = await this.finalProductService.updateFinalProduct(req.params.id, dto);
      res.json(finalProduct);
    } catch (error) {
      next(error);
    }
  }

  public async deleteFinalProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await this.finalProductService.deleteFinalProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
