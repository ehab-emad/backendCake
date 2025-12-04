import { injectable, inject } from "inversify";
import { v4 as uuid } from "uuid";
import { IShapeRepository } from "../../core/interfaces/repositories/IShapeRepository";
import { Shape } from "../../core/entities/Shape";
import { ShapeImage } from "../../core/entities/ShapeImage";
import { CreateShapeDTO } from "../dto/CreateShape.dto";
import { UpdateShapeDTO } from "../dto/UpdateShape.dto";
import { FilterShapeDTO } from "../dto/FilterShape.dto";
import { TYPES } from "../../shared/di/types";

@injectable()
export class ShapeService {
  constructor(
    @inject(TYPES.IShapeRepository)
    private readonly shapeRepo: IShapeRepository
  ) {}

  public async createShape(dto: CreateShapeDTO): Promise<Shape> {
    const shapeId = uuid();
    const shape = new Shape(
      shapeId,
      dto.name,
      dto.numberOfPeople,
      dto.weight,
      dto.width,
      dto.height,
      dto.price,
      new Date(),
      new Date()
    );

    // Handle uploaded images for creation
    if (dto.frontImage) {
      shape.addImage(new ShapeImage(uuid(), shapeId, dto.frontImage));
    }
    if (dto.sideImage) {
      shape.addImage(new ShapeImage(uuid(), shapeId, dto.sideImage));
    }
    if (dto.leftImage) {
      shape.addImage(new ShapeImage(uuid(), shapeId, dto.leftImage));
    }
    
    await this.shapeRepo.create(shape);
    return shape;
  }

  public async getShape(id: string): Promise<Shape> {
    const shape = await this.shapeRepo.findById(id);
    if (!shape) {
      throw new Error("Shape not found");
    }
    return shape;
  }

  public async listShapes(filters: FilterShapeDTO): Promise<{ data: Shape[]; total: number }> {
    return this.shapeRepo.listShapes(filters);
  }

  public async updateShape(id: string, dto: UpdateShapeDTO): Promise<Shape> {
    const shape = await this.getShape(id);

    if (dto.name) shape.name = dto.name;
    if (dto.numberOfPeople) shape.numberOfPeople = dto.numberOfPeople;
    if (dto.weight) shape.weight = dto.weight;
    if (dto.width) shape.width = dto.width;
    if (dto.height) shape.height = dto.height;
    if (dto.price) shape.price = dto.price;

    // Handle uploaded images for update
    if (dto.frontImage) {
      shape.addImage(new ShapeImage(uuid(), id, dto.frontImage));
    }
    if (dto.sideImage) {
      shape.addImage(new ShapeImage(uuid(), id, dto.sideImage));
    }
    if (dto.leftImage) {
      shape.addImage(new ShapeImage(uuid(), id, dto.leftImage));
    }

    if (dto.removeImageIds && dto.removeImageIds.length > 0) {
      for (const imageId of dto.removeImageIds) {
        shape.removeImage(imageId);
      }
    }

    await this.shapeRepo.update(shape);
    return shape;
  }

  public async deleteShape(id: string): Promise<void> {
    await this.shapeRepo.delete(id);
  }

  public async addImage(shapeId: string, imageUrl: string): Promise<Shape> {
    const shape = await this.getShape(shapeId);
    const image = new ShapeImage(uuid(), shapeId, imageUrl);
    shape.addImage(image);
    await this.shapeRepo.addImage(shapeId, image);
    return shape;
  }

  public async removeImage(shapeId: string, imageId: string): Promise<ShapeImage[]> {
    const shape = await this.getShape(shapeId);
    shape.removeImage(imageId);
    await this.shapeRepo.removeImage(imageId);
    return this.shapeRepo.listImagesForShape(shapeId);
  }
}
