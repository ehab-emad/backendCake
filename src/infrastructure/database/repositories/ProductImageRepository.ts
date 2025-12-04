import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { ProductImageEntity } from "../models/ProductImage.model";
import { IProductImageRepository } from "../../../core/interfaces/repositories/IProductImageRepository";
import { ProductImage } from "../../../core/entities/ProductImage";

@injectable()
export class ProductImageRepository implements IProductImageRepository {
  private readonly repo: Repository<ProductImageEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(ProductImageEntity);
  }

  private toDomain(entity: ProductImageEntity): ProductImage {
    return new ProductImage(
      entity.id,
      entity.productId,
      entity.path
    );
  }

  private toEntity(domain: ProductImage): ProductImageEntity {
    const entity = new ProductImageEntity();
    entity.id = domain.id;
    entity.productId = domain.productId;
    entity.path = domain.path;
    return entity;
  }

  async create(image: ProductImage): Promise<void> {
    const entity = this.repo.create(this.toEntity(image));
    await this.repo.save(entity);
  }

  async listForProduct(productId: string): Promise<ProductImage[]> {
    const entities = await this.repo.find({ where: { productId } });
    return entities.map(this.toDomain);
  }

  async removeById(imageId: string): Promise<void> {
    await this.repo.delete(imageId);
  }
}
