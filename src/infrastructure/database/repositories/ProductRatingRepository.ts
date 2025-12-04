import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { ProductRatingEntity } from "../models/ProductRating.model";
import { IProductRatingRepository } from "../../../core/interfaces/repositories/IProductRatingRepository";
import { ProductRating } from "../../../core/entities/ProductRating";

@injectable()
export class ProductRatingRepository implements IProductRatingRepository {
  private readonly repo: Repository<ProductRatingEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(ProductRatingEntity);
  }

  private toDomain(entity: ProductRatingEntity): ProductRating {
    return new ProductRating(
      entity.id,
      entity.productId,
      entity.name,
      entity.comment,
      entity.rating,
      entity.images
    );
  }

  private toEntity(domain: ProductRating): ProductRatingEntity {
    const entity = new ProductRatingEntity();
    entity.id = domain.id;
    entity.productId = domain.productId;
    entity.name = domain.name;
    entity.comment = domain.comment;
    entity.rating = domain.rating;
    entity.images = domain.images;
    return entity;
  }

  async create(rating: ProductRating): Promise<void> {
    const entity = this.repo.create(this.toEntity(rating));
    await this.repo.save(entity);
  }

  async listForProduct(productId: string): Promise<ProductRating[]> {
    const entities = await this.repo.find({ where: { productId } });
    return entities.map(this.toDomain);
  }

  async removeById(ratingId: string): Promise<void> {
    await this.repo.delete(ratingId);
  }
}
