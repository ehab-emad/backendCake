import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { FlavorService } from "../../application/services/FlavorService";
import { CreateFlavorDTO } from "../../application/dto/CreateFlavor.dto";
import { UpdateFlavorDTO } from "../../application/dto/UpdateFlavor.dto";
import { FilterFlavorDTO } from "../../application/dto/FilterFlavor.dto";
import { TYPES } from "../../shared/di/types";
import { CreateFlavorSchema } from "../../application/dto/CreateFlavor.dto";
import { UpdateFlavorSchema } from "../../application/dto/UpdateFlavor.dto";
import { FilterFlavorSchema } from "../../application/dto/FilterFlavor.dto";

@injectable()
export class FlavorController {
  constructor(
    @inject(TYPES.FlavorService)
    private readonly flavorService: FlavorService
  ) {}

  public async listFlavors(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = FilterFlavorSchema.parse(req.query);
      const result = await this.flavorService.listFlavors(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async createFlavor(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateFlavorSchema.parse(req.body);
      const flavor = await this.flavorService.createFlavor(dto);
      res.status(201).json(flavor);
    } catch (error) {
      next(error);
    }
  }

  public async getFlavor(req: Request, res: Response, next: NextFunction) {
    try {
      const flavor = await this.flavorService.getFlavor(req.params.id);
      res.json(flavor);
    } catch (error) {
      next(error);
    }
  }

  public async updateFlavor(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = UpdateFlavorSchema.parse(req.body);
      const flavor = await this.flavorService.updateFlavor(req.params.id, dto);
      res.json(flavor);
    } catch (error) {
      next(error);
    }
  }

  public async deleteFlavor(req: Request, res: Response, next: NextFunction) {
    try {
      await this.flavorService.deleteFlavor(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async addImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;
      const result = await this.flavorService.addImage(id, imageUrl);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async removeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { flavorId, imageId } = req.params;
      const images = await this.flavorService.removeImage(flavorId, imageId);
      res.json(images);
    } catch (error) {
      next(error);
    }
  }
}
