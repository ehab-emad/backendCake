import { injectable } from "inversify";
import { Repository, DataSource, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { FinalProductEntity } from "../models/FinalProduct.model";
import { IFinalProductRepository } from "../../../core/interfaces/repositories/IFinalProductRepository";
import { FinalProduct } from "../../../core/entities/FinalProduct";
import { FilterFinalProductDTO } from "../../../application/dto/FilterFinalProduct.dto";
import { TYPES } from "../../../shared/di/types";
import { inject } from "inversify";
import { IMaskRepository } from "../../../core/interfaces/repositories/IMaskRepository";

@injectable()
export class FinalProductRepository implements IFinalProductRepository {
  private readonly finalProductRepo: Repository<FinalProductEntity>;

  constructor(
    @inject(TYPES.IMaskRepository) private readonly maskRepo: IMaskRepository
  ) {
    this.finalProductRepo = AppDataSource.getRepository(FinalProductEntity);
  }

  private toDomain(entity: FinalProductEntity): FinalProduct {
    return new FinalProduct(
      entity.id,
      entity.maskId,
      entity.name,
      entity.price,
      entity.category,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: FinalProduct): FinalProductEntity {
    const entity = new FinalProductEntity();
    entity.id = domain.id;
    entity.maskId = domain.maskId;
    entity.name = domain.name;
    entity.price = domain.price;
    entity.category = domain.category;
    entity.createdAt = domain.createdAt || new Date();
    entity.updatedAt = domain.updatedAt || new Date();
    return entity;
  }

  async create(finalProduct: FinalProduct): Promise<void> {
    const entity = this.finalProductRepo.create(this.toEntity(finalProduct));
    await this.finalProductRepo.save(entity);
  }

  async findById(id: string): Promise<FinalProduct | null> {
    const entity = await this.finalProductRepo.findOne({
      where: { id },
      relations: ["mask"],
    });
    if (!entity) return null;
    const finalProduct = this.toDomain(entity);
    return finalProduct;
  }

  async listFinalProducts(filters: FilterFinalProductDTO): Promise<{ data: FinalProduct[]; total: number }> {
    const queryBuilder = this.finalProductRepo.createQueryBuilder("finalProduct");

    if (filters.name) {
      queryBuilder.andWhere("finalProduct.name LIKE :name", { name: `%${filters.name}%` });
    }
    if (filters.maskId) {
      queryBuilder.andWhere("finalProduct.maskId = :maskId", { maskId: filters.maskId });
    }
    if (filters.minPrice) {
      queryBuilder.andWhere("finalProduct.price >= :minPrice", { minPrice: filters.minPrice });
    }
    if (filters.maxPrice) {
      queryBuilder.andWhere("finalProduct.price <= :maxPrice", { maxPrice: filters.maxPrice });
    }
    if (filters.category) {
      queryBuilder.andWhere("finalProduct.category LIKE :category", { category: `%${filters.category}%` });
    }

    queryBuilder.leftJoinAndSelect("finalProduct.mask", "mask");

    const [entities, total] = await queryBuilder
      .skip(filters.offset)
      .take(filters.limit)
      .getManyAndCount();

    const data = entities.map(entity => {
      const finalProduct = this.toDomain(entity);
      return finalProduct;
    });

    return { data, total };
  }

  async update(finalProduct: FinalProduct): Promise<void> {
    const entity = this.toEntity(finalProduct);
    await this.finalProductRepo.update(finalProduct.id, entity);
  }

  async delete(id: string): Promise<void> {
    await this.finalProductRepo.delete(id);
  }
}
