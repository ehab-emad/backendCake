import { injectable } from "inversify";
import { Repository, DataSource, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { MaskEntity } from "../models/Mask.model";
import { MaskImageEntity } from "../models/MaskImage.model";
import { IShapeRepository } from "../../../core/interfaces/repositories/IShapeRepository";
import { IFlavorRepository } from "../../../core/interfaces/repositories/IFlavorRepository";
import { IMaskRepository } from "../../../core/interfaces/repositories/IMaskRepository";
import { Mask } from "../../../core/entities/Mask";
import { MaskImage } from "../../../core/entities/MaskImage";
import { FilterMaskDTO } from "../../../application/dto/FilterMask.dto";
import { TYPES } from "../../../shared/di/types";
import { inject } from "inversify";

@injectable()
export class MaskRepository implements IMaskRepository {
  private readonly maskRepo: Repository<MaskEntity>;
  private readonly maskImageRepo: Repository<MaskImageEntity>;

  constructor(
    @inject(TYPES.IShapeRepository) private readonly shapeRepo: IShapeRepository,
    @inject(TYPES.IFlavorRepository) private readonly flavorRepo: IFlavorRepository
  ) {
    this.maskRepo = AppDataSource.getRepository(MaskEntity);
    this.maskImageRepo = AppDataSource.getRepository(MaskImageEntity);
  }

  private toDomain(entity: MaskEntity): Mask {
    return new Mask(
      entity.id,
      entity.name,
      entity.shapeId,
      entity.flavorId,
      entity.price,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: Mask): MaskEntity {
    const entity = new MaskEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.shapeId = domain.shapeId;
    entity.flavorId = domain.flavorId;
    entity.price = domain.price;
    entity.createdAt = domain.createdAt || new Date();
    entity.updatedAt = domain.updatedAt || new Date();
    return entity;
  }

  async create(mask: Mask): Promise<void> {
    const entity = this.maskRepo.create(this.toEntity(mask));
    await this.maskRepo.save(entity);

    if (mask.images && mask.images.length > 0) {
      const imageEntities = mask.images.map(image => {
        const img = new MaskImageEntity();
        img.id = image.id;
        img.maskId = mask.id;
        img.imageUrl = image.imageUrl;
        return img;
      });
      await this.maskImageRepo.save(imageEntities);
    }
  }

  async findById(id: string): Promise<Mask | null> {
    const entity = await this.maskRepo.findOne({
      where: { id },
      relations: ["images", "shape", "flavor"],
    });
    if (!entity) return null;
    const mask = this.toDomain(entity);
    mask.images = entity.images.map(img => new MaskImage(img.id, img.maskId, img.imageUrl));
    return mask;
  }

  async listMasks(filters: FilterMaskDTO): Promise<{ data: Mask[]; total: number }> {
    const queryBuilder = this.maskRepo.createQueryBuilder("mask");

    if (filters.name) {
      queryBuilder.andWhere("mask.name LIKE :name", { name: `%${filters.name}%` });
    }
    if (filters.shapeId) {
      queryBuilder.andWhere("mask.shapeId = :shapeId", { shapeId: filters.shapeId });
    }
    if (filters.flavorId) {
      queryBuilder.andWhere("mask.flavorId = :flavorId", { flavorId: filters.flavorId });
    }
    if (filters.minPrice) {
      queryBuilder.andWhere("mask.price >= :minPrice", { minPrice: filters.minPrice });
    }
    if (filters.maxPrice) {
      queryBuilder.andWhere("mask.price <= :maxPrice", { maxPrice: filters.maxPrice });
    }

    queryBuilder.leftJoinAndSelect("mask.images", "images");
    queryBuilder.leftJoinAndSelect("mask.shape", "shape");
    queryBuilder.leftJoinAndSelect("mask.flavor", "flavor");

    const [entities, total] = await queryBuilder
      .skip(filters.offset)
      .take(filters.limit)
      .getManyAndCount();

    const data = entities.map(entity => {
      const mask = this.toDomain(entity);
      mask.images = entity.images.map(img => new MaskImage(img.id, img.maskId, img.imageUrl));
      return mask;
    });

    return { data, total };
  }

  async update(mask: Mask): Promise<void> {
    const entity = this.toEntity(mask);
    await this.maskRepo.update(mask.id, entity);
  }

  async delete(id: string): Promise<void> {
    await this.maskRepo.delete(id);
  }

  async addImage(maskId: string, image: MaskImage): Promise<void> {
    const mask = await this.maskRepo.findOneBy({ id: maskId });
    if (!mask) {
      throw new Error("Mask not found");
    }
    const imageEntity = new MaskImageEntity();
    imageEntity.id = image.id;
    imageEntity.maskId = maskId;
    imageEntity.imageUrl = image.imageUrl;
    await this.maskImageRepo.save(imageEntity);
  }

  async removeImage(imageId: string): Promise<void> {
    await this.maskImageRepo.delete(imageId);
  }

  async listImagesForMask(maskId: string): Promise<MaskImage[]> {
    const images = await this.maskImageRepo.find({ where: { maskId } });
    return images.map(img => new MaskImage(img.id, img.maskId, img.imageUrl));
  }
}
