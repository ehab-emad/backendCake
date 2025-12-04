import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { MaskService } from "../../application/services/MaskService";
import { CreateMaskDTO } from "../../application/dto/CreateMask.dto";
import { UpdateMaskDTO } from "../../application/dto/UpdateMask.dto";
import { FilterMaskDTO } from "../../application/dto/FilterMask.dto";
import { TYPES } from "../../shared/di/types";
import { CreateMaskSchema } from "../../application/dto/CreateMask.dto";
import { UpdateMaskSchema } from "../../application/dto/UpdateMask.dto";
import { FilterMaskSchema } from "../../application/dto/FilterMask.dto";

@injectable()
export class MaskController {
  constructor(
    @inject(TYPES.MaskService)
    private readonly maskService: MaskService
  ) {}

  public async listMasks(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = FilterMaskSchema.parse(req.query);
      const result = await this.maskService.listMasks(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async createMask(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateMaskSchema.parse(req.body);
      const mask = await this.maskService.createMask(dto);
      res.status(201).json(mask);
    } catch (error) {
      next(error);
    }
  }

  public async getMask(req: Request, res: Response, next: NextFunction) {
    try {
      const mask = await this.maskService.getMask(req.params.id);
      res.json(mask);
    } catch (error) {
      next(error);
    }
  }

  public async updateMask(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = UpdateMaskSchema.parse(req.body);
      const mask = await this.maskService.updateMask(req.params.id, dto);
      res.json(mask);
    } catch (error) {
      next(error);
    }
  }

  public async deleteMask(req: Request, res: Response, next: NextFunction) {
    try {
      await this.maskService.deleteMask(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async addImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;
      const result = await this.maskService.addImage(id, imageUrl);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async removeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { maskId, imageId } = req.params;
      const images = await this.maskService.removeImage(maskId, imageId);
      res.json(images);
    } catch (error) {
      next(error);
    }
  }
}
