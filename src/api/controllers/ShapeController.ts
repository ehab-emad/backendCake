import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { ShapeService } from "../../application/services/ShapeService";
import { CreateShapeDTO } from "../../application/dto/CreateShape.dto";
import { UpdateShapeDTO } from "../../application/dto/UpdateShape.dto";
import { FilterShapeDTO } from "../../application/dto/FilterShape.dto";
import { TYPES } from "../../shared/di/types";
import { CreateShapeSchema } from "../../application/dto/CreateShape.dto";
import { UpdateShapeSchema } from "../../application/dto/UpdateShape.dto";
import { FilterShapeSchema } from "../../application/dto/FilterShape.dto";

@injectable()
export class ShapeController {
  constructor(
    @inject(TYPES.ShapeService)
    private readonly shapeService: ShapeService
  ) {}

  public async listShapes(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = FilterShapeSchema.parse(req.query);
      const result = await this.shapeService.listShapes(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async createShape(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateShapeSchema.parse(req.body);
      const shape = await this.shapeService.createShape(dto);
      res.status(201).json(shape);
    } catch (error) {
      next(error);
    }
  }

  public async getShape(req: Request, res: Response, next: NextFunction) {
    try {
      const shape = await this.shapeService.getShape(req.params.id);
      res.json(shape);
    } catch (error) {
      next(error);
    }
  }

  public async updateShape(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = UpdateShapeSchema.parse(req.body);
      const shape = await this.shapeService.updateShape(req.params.id, dto);
      res.json(shape);
    } catch (error) {
      next(error);
    }
  }

  public async deleteShape(req: Request, res: Response, next: NextFunction) {
    try {
      await this.shapeService.deleteShape(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async addImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;
      const result = await this.shapeService.addImage(id, imageUrl);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async removeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { shapeId, imageId } = req.params;
      const images = await this.shapeService.removeImage(shapeId, imageId);
      res.json(images);
    } catch (error) {
      next(error);
    }
  }
}
