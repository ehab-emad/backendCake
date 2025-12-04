import { injectable } from "inversify";
import { Repository, DataSource, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { ShapeEntity } from "../models/Shape.model";
import { ShapeImageEntity } from "../models/ShapeImage.model";
import { IShapeRepository } from "../../../core/interfaces/repositories/IShapeRepository";
import { Shape } from "../../../core/entities/Shape";
import { ShapeImage } from "../../../core/entities/ShapeImage";
import { FilterShapeDTO } from "../../../application/dto/FilterShape.dto";

@injectable()
export class ShapeRepository implements IShapeRepository {
  private readonly shapeRepo: Repository<ShapeEntity>;
  private readonly shapeImageRepo: Repository<ShapeImageEntity>;

  constructor() {
    this.shapeRepo = AppDataSource.getRepository(ShapeEntity);
    this.shapeImageRepo = AppDataSource.getRepository(ShapeImageEntity);
  }

  private toDomain(entity: ShapeEntity): Shape {
    return new Shape(
      entity.id,
      entity.name,
      entity.numberOfPeople,
      entity.weight,
      entity.width,
      entity.height,
      entity.price,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: Shape): ShapeEntity {
    const entity = new ShapeEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.numberOfPeople = domain.numberOfPeople;
    entity.weight = domain.weight;
    entity.width = domain.width;
    entity.height = domain.height;
    entity.price = domain.price;
    entity.createdAt = domain.createdAt || new Date();
    entity.updatedAt = domain.updatedAt || new Date();
    return entity;
  }

  async create(shape: Shape): Promise<void> {
    const entity = this.shapeRepo.create(this.toEntity(shape));
    await this.shapeRepo.save(entity);

    if (shape.images && shape.images.length > 0) {
      const imageEntities = shape.images.map(image => {
        const img = new ShapeImageEntity();
        img.id = image.id;
        img.shapeId = shape.id;
        img.imageUrl = image.imageUrl;
        return img;
      });
      await this.shapeImageRepo.save(imageEntities);
    }
  }

  async findById(id: string): Promise<Shape | null> {
    const entity = await this.shapeRepo.findOne({
      where: { id },
      relations: ["images"],
    });
    if (!entity) return null;
    const shape = this.toDomain(entity);
    shape.images = entity.images.map(img => new ShapeImage(img.id, img.shapeId, img.imageUrl));
    return shape;
  }

  async listShapes(filters: FilterShapeDTO): Promise<{ data: Shape[]; total: number }> {
    const queryBuilder = this.shapeRepo.createQueryBuilder("shape");

    if (filters.name) {
      queryBuilder.andWhere("shape.name LIKE :name", { name: `%${filters.name}%` });
    }
    if (filters.numberOfPeople) {
      queryBuilder.andWhere("shape.numberOfPeople = :numberOfPeople", { numberOfPeople: filters.numberOfPeople });
    }
    if (filters.minPrice) {
      queryBuilder.andWhere("shape.price >= :minPrice", { minPrice: filters.minPrice });
    }
    if (filters.maxPrice) {
      queryBuilder.andWhere("shape.price <= :maxPrice", { maxPrice: filters.maxPrice });
    }

    queryBuilder.leftJoinAndSelect("shape.images", "images");

    const [entities, total] = await queryBuilder
      .skip(filters.offset)
      .take(filters.limit)
      .getManyAndCount();

    const data = entities.map(entity => {
      const shape = this.toDomain(entity);
      shape.images = entity.images.map(img => new ShapeImage(img.id, img.shapeId, img.imageUrl));
      return shape;
    });

    return { data, total };
  }

  async update(shape: Shape): Promise<void> {
    const entity = this.toEntity(shape);
    await this.shapeRepo.update(shape.id, entity);
  }

  async delete(id: string): Promise<void> {
    await this.shapeRepo.delete(id);
  }

  async addImage(shapeId: string, image: ShapeImage): Promise<void> {
    const shape = await this.shapeRepo.findOneBy({ id: shapeId });
    if (!shape) {
      throw new Error("Shape not found");
    }
    const imageEntity = new ShapeImageEntity();
    imageEntity.id = image.id;
    imageEntity.shapeId = shapeId;
    imageEntity.imageUrl = image.imageUrl;
    await this.shapeImageRepo.save(imageEntity);
  }

  async removeImage(imageId: string): Promise<void> {
    await this.shapeImageRepo.delete(imageId);
  }

  async listImagesForShape(shapeId: string): Promise<ShapeImage[]> {
    const images = await this.shapeImageRepo.find({ where: { shapeId } });
    return images.map(img => new ShapeImage(img.id, img.shapeId, img.imageUrl));
  }
}
