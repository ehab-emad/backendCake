import { injectable } from "inversify";
import { Repository, DataSource, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { FlavorEntity } from "../models/Flavor.model";
import { FlavorImageEntity } from "../models/FlavorImage.model";
import { IShapeRepository } from "../../../core/interfaces/repositories/IShapeRepository";
import { IFlavorRepository } from "../../../core/interfaces/repositories/IFlavorRepository";
import { Flavor } from "../../../core/entities/Flavor";
import { FlavorImage } from "../../../core/entities/FlavorImage";
import { FilterFlavorDTO } from "../../../application/dto/FilterFlavor.dto";
import { TYPES } from "../../../shared/di/types";
import { inject } from "inversify";

@injectable()
export class FlavorRepository implements IFlavorRepository {
  private readonly flavorRepo: Repository<FlavorEntity>;
  private readonly flavorImageRepo: Repository<FlavorImageEntity>;

  constructor(
    @inject(TYPES.IShapeRepository) private readonly shapeRepo: IShapeRepository
  ) {
    this.flavorRepo = AppDataSource.getRepository(FlavorEntity);
    this.flavorImageRepo = AppDataSource.getRepository(FlavorImageEntity);
  }

  private toDomain(entity: FlavorEntity): Flavor {
    return new Flavor(
      entity.id,
      entity.name,
      entity.shapeId,
      entity.price,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: Flavor): FlavorEntity {
    const entity = new FlavorEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.shapeId = domain.shapeId;
    entity.price = domain.price;
    entity.createdAt = domain.createdAt || new Date();
    entity.updatedAt = domain.updatedAt || new Date();
    return entity;
  }

  async create(flavor: Flavor): Promise<void> {
    const entity = this.flavorRepo.create(this.toEntity(flavor));
    await this.flavorRepo.save(entity);

    if (flavor.images && flavor.images.length > 0) {
      const imageEntities = flavor.images.map(image => {
        const img = new FlavorImageEntity();
        img.id = image.id;
        img.flavorId = flavor.id;
        img.imageUrl = image.imageUrl;
        return img;
      });
      await this.flavorImageRepo.save(imageEntities);
    }
  }

  async findById(id: string): Promise<Flavor | null> {
    const entity = await this.flavorRepo.findOne({
      where: { id },
      relations: ["images", "shape"],
    });
    if (!entity) return null;
    const flavor = this.toDomain(entity);
    flavor.images = entity.images.map(img => new FlavorImage(img.id, img.flavorId, img.imageUrl));
    return flavor;
  }

  async listFlavors(filters: FilterFlavorDTO): Promise<{ data: Flavor[]; total: number }> {
    const queryBuilder = this.flavorRepo.createQueryBuilder("flavor");

    if (filters.name) {
      queryBuilder.andWhere("flavor.name LIKE :name", { name: `%${filters.name}%` });
    }
    if (filters.shapeId) {
      queryBuilder.andWhere("flavor.shapeId = :shapeId", { shapeId: filters.shapeId });
    }
    if (filters.minPrice) {
      queryBuilder.andWhere("flavor.price >= :minPrice", { minPrice: filters.minPrice });
    }
    if (filters.maxPrice) {
      queryBuilder.andWhere("flavor.price <= :maxPrice", { maxPrice: filters.maxPrice });
    }

    queryBuilder.leftJoinAndSelect("flavor.images", "images");
    queryBuilder.leftJoinAndSelect("flavor.shape", "shape");

    const [entities, total] = await queryBuilder
      .skip(filters.offset)
      .take(filters.limit)
      .getManyAndCount();

    const data = entities.map(entity => {
      const flavor = this.toDomain(entity);
      flavor.images = entity.images.map(img => new FlavorImage(img.id, img.flavorId, img.imageUrl));
      return flavor;
    });

    return { data, total };
  }

  async update(flavor: Flavor): Promise<void> {
    const entity = this.toEntity(flavor);
    await this.flavorRepo.update(flavor.id, entity);
  }

  async delete(id: string): Promise<void> {
    await this.flavorRepo.delete(id);
  }

  async addImage(flavorId: string, image: FlavorImage): Promise<void> {
    const flavor = await this.flavorRepo.findOneBy({ id: flavorId });
    if (!flavor) {
      throw new Error("Flavor not found");
    }
    const imageEntity = new FlavorImageEntity();
    imageEntity.id = image.id;
    imageEntity.flavorId = flavorId;
    imageEntity.imageUrl = image.imageUrl;
    await this.flavorImageRepo.save(imageEntity);
  }

  async removeImage(imageId: string): Promise<void> {
    await this.flavorImageRepo.delete(imageId);
  }

  async listImagesForFlavor(flavorId: string): Promise<FlavorImage[]> {
    const images = await this.flavorImageRepo.find({ where: { flavorId } });
    return images.map(img => new FlavorImage(img.id, img.flavorId, img.imageUrl));
  }
}
