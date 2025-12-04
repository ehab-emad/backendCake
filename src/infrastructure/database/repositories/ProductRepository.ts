import { injectable } from "inversify";
import { Repository, DataSource, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { ProductEntity } from "../models/Product.model";
import { ProductImageEntity } from "../models/ProductImage.model";
import { ProductRatingEntity } from "../models/ProductRating.model";
import { IProductRepository } from "../../../core/interfaces/repositories/IProductRepository";
import { Product } from "../../../core/entities/Product";
import { ProductImage } from "../../../core/entities/ProductImage";
import { ProductRating } from "../../../core/entities/ProductRating";
import { FilterProductDTO } from "../../../application/dto/FilterProduct.dto";

@injectable()
export class ProductRepository implements IProductRepository {
  private readonly productRepo: Repository<ProductEntity>;
  private readonly productImageRepo: Repository<ProductImageEntity>;
  private readonly productRatingRepo: Repository<ProductRatingEntity>;

  constructor() {
    this.productRepo = AppDataSource.getRepository(ProductEntity);
    this.productImageRepo = AppDataSource.getRepository(ProductImageEntity);
    this.productRatingRepo = AppDataSource.getRepository(ProductRatingEntity);
  }

  private toDomain(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.clientId,
      entity.description,
      entity.fullDescription,
      entity.price,
      entity.stockQuantity,
      entity.imageUrl,
      entity.material,
      entity.beads,
      entity.length,
      entity.weight,
      entity.rating,
      entity.sales,
      entity.status,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.clientId=domain.clientId;
    entity.description = domain.description;
    entity.fullDescription = domain.fullDescription;
    entity.price = domain.price;
    entity.stockQuantity = domain.stockQuantity;
    entity.imageUrl = domain.imageUrl;
    entity.material = domain.material;
    entity.beads = domain.beads;
    entity.length = domain.length;
    entity.weight = domain.weight;
    entity.rating = domain.rating;
    entity.sales = domain.sales;
    entity.status = domain.status;
    entity.createdAt = domain.createdAt || new Date();
    entity.updatedAt = domain.updatedAt || new Date();
    return entity;
  }

  async create(product: Product): Promise<void> {
    const entity = this.productRepo.create(this.toEntity(product));
    await this.productRepo.save(entity);

    if (product.images && product.images.length > 0) {
      const imageEntities = product.images.map(image => {
        const img = new ProductImageEntity();
        img.id = image.id;
        img.productId = product.id;
        img.path = image.path;
        return img;
      });
      await this.productImageRepo.save(imageEntities);
    }

    if (product.ratings && product.ratings.length > 0) {
      const ratingEntities = product.ratings.map(rating => {
        const rtg = new ProductRatingEntity();
        rtg.id = rating.id;
        rtg.productId = product.id;
        rtg.name = rating.name;
        rtg.comment = rating.comment;
        rtg.rating = rating.rating;
        rtg.images = rating.images;
        return rtg;
      });
      await this.productRatingRepo.save(ratingEntities);
    }
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.productRepo.findOne({
      where: { id },
      relations: ["images", "ratings", "client"],
    });
    if (!entity) return null;
    const product = this.toDomain(entity);
    product.images = entity.images.map(img => new ProductImage(img.id, img.productId, img.path));
    product.ratings = entity.ratings.map(rtg => new ProductRating(rtg.id, rtg.productId, rtg.name, rtg.comment, rtg.rating, rtg.images));
    return product;
  }

  async listProducts(filters: FilterProductDTO): Promise<{ data: Product[]; total: number }> {
    const queryBuilder = this.productRepo.createQueryBuilder("product");

    if (filters.name) {
      queryBuilder.andWhere("product.name LIKE :name", { name: `%${filters.name}%` });
    }
    if (filters.minPrice) {
      queryBuilder.andWhere("product.price >= :minPrice", { minPrice: filters.minPrice });
    }
    if (filters.maxPrice) {
      queryBuilder.andWhere("product.price <= :maxPrice", { maxPrice: filters.maxPrice });
    }
    if (filters.status) {
      queryBuilder.andWhere("product.status = :status", { status: filters.status });
    }
    if (filters.minRating) {
      queryBuilder.andWhere("product.rating >= :minRating", { minRating: filters.minRating });
    }
    if (filters.maxRating) {
      queryBuilder.andWhere("product.rating <= :maxRating", { maxRating: filters.maxRating });
    }
    if (filters.material) {
        queryBuilder.andWhere("product.material LIKE :material", { material: `%${filters.material}%` });
    }
    if (filters.beads) {
        queryBuilder.andWhere("product.beads LIKE :beads", { beads: `%${filters.beads}%` });
    }
    if (filters.length) {
        queryBuilder.andWhere("product.length LIKE :length", { length: `%${filters.length}%` });
    }
    if (filters.weight) {
        queryBuilder.andWhere("product.weight LIKE :weight", { weight: `%${filters.weight}%` });
    }
    if (filters.search) {
      queryBuilder.andWhere("("
        + "product.name LIKE :search OR "
        + "product.description LIKE :search OR "
        + "product.fullDescription LIKE :search"
        + ")", { search: `%${filters.search}%` });
    }

    queryBuilder.leftJoinAndSelect("product.images", "images");
    queryBuilder.leftJoinAndSelect("product.ratings", "ratings");
    queryBuilder.leftJoinAndSelect("product.client", "client");

    const [entities, total] = await queryBuilder
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getManyAndCount();

    const data = entities.map(entity => {
      const product = this.toDomain(entity);
      product.images = entity.images.map(img => new ProductImage(img.id, img.productId, img.path));
      product.ratings = entity.ratings.map(rtg => new ProductRating(rtg.id, rtg.productId, rtg.name, rtg.comment, rtg.rating, rtg.images));
      return product;
    });

    return { data, total };
  }

  async update(product: Product): Promise<void> {
    const entity = this.toEntity(product);
    await this.productRepo.update(product.id, entity);
  }

  async delete(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }

  async addRating(productId: string, rating: ProductRating): Promise<void> {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) {
      throw new Error("Product not found");
    }
    const ratingEntity = new ProductRatingEntity();
    ratingEntity.id = rating.id;
    ratingEntity.productId = productId;
    ratingEntity.name = rating.name;
    ratingEntity.comment = rating.comment;
    ratingEntity.rating = rating.rating;
    ratingEntity.images = rating.images;
    await this.productRatingRepo.save(ratingEntity);
  }

  async removeImage(imageId: string): Promise<void> {
    await this.productImageRepo.delete(imageId);
  }

  async listImagesForProduct(productId: string): Promise<ProductImage[]> {
    const images = await this.productImageRepo.find({ where: { productId } });
    return images.map(img => new ProductImage(img.id, img.productId, img.path));
  }
}
