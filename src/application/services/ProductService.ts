import { injectable, inject } from "inversify";
import { v4 as uuid } from "uuid";
import { IProductRepository } from "../../core/interfaces/repositories/IProductRepository";
import { Product } from "../../core/entities/Product";
import { ProductImage } from "../../core/entities/ProductImage";
import { ProductRating } from "../../core/entities/ProductRating";
import { CreateProductDTO } from "../dto/CreateProduct.dto";
import { UpdateProductDTO } from "../dto/UpdateProduct.dto";
import { FilterProductDTO } from "../dto/FilterProduct.dto";
import { TYPES } from "../../shared/di/types";

@injectable()
export class ProductService {
  constructor(
    @inject(TYPES.IProductRepository)
    private readonly productRepo: IProductRepository
  ) {}

  public async createProduct(dto: CreateProductDTO): Promise<Product> {
    const productId = uuid();
    const product = new Product(
      productId,
      dto.name,
      dto.clientId,
      dto.description,
      dto.fullDescription,
      dto.price,
      dto.stockQuantity,
      dto.imageUrl,
      dto.material,
      dto.beads,
      dto.length,
      dto.weight,
      dto.ratings && dto.ratings.length > 0 ? dto.ratings.reduce((acc, r) => acc + r.rating, 0) / dto.ratings.length : 0,
      0, // sales
      dto.status,
      new Date(),
      new Date()
    );

    if (dto.images) {
      for (const path of dto.images) {
        product.addImage(new ProductImage(uuid(), productId, path));
      }
    }

    if (dto.ratings) {
      for (const rtgDto of dto.ratings) {
        const rating = new ProductRating(uuid(), productId, rtgDto.name, rtgDto.comment, rtgDto.rating, rtgDto.images);
        product.addRating(rating);
      }
    }
    
    await this.productRepo.create(product);
    return product;
  }

  public async getProduct(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  public async listProducts(filters: FilterProductDTO): Promise<{ data: Product[]; total: number }> {
    return this.productRepo.listProducts(filters);
  }

  public async updateProduct(id: string, dto: UpdateProductDTO): Promise<Product> {
    const product = await this.getProduct(id);

    if (dto.name) product.name = dto.name;
    if (dto.clientId) product.clientId = dto.clientId;
    if (dto.description) product.description = dto.description;
    if (dto.fullDescription) product.fullDescription = dto.fullDescription;
    if (dto.price) product.price = dto.price;
    if (dto.stockQuantity) product.stockQuantity = dto.stockQuantity;
    if (dto.imageUrl) product.imageUrl = dto.imageUrl;
    if (dto.material) product.material = dto.material;
    if (dto.beads) product.beads = dto.beads;
    if (dto.length) product.length = dto.length;
    if (dto.weight) product.weight = dto.weight;
    if (dto.status) product.status = dto.status;

    if (dto.newImages && dto.newImages.length > 0) {
      for (const path of dto.newImages) {
        product.addImage(new ProductImage(uuid(), id, path));
      }
    }

    if (dto.removeImageIds && dto.removeImageIds.length > 0) {
      for (const imageId of dto.removeImageIds) {
        product.removeImage(imageId);
      }
    }

    await this.productRepo.update(product);
    return product;
  }

  public async deleteProduct(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }

  public async addRating(productId: string, ratingDto: { name: string; comment?: string; rating: number; images?: string[] }): Promise<Product> {
    const product = await this.getProduct(productId);
    const rating = new ProductRating(uuid(), productId, ratingDto.name, ratingDto.comment, ratingDto.rating, ratingDto.images);
    product.addRating(rating);
    await this.productRepo.addRating(productId, rating);
    return product;
  }

  public async removeImage(productId: string, imageId: string): Promise<ProductImage[]> {
    const product = await this.getProduct(productId);
    product.removeImage(imageId);
    await this.productRepo.removeImage(imageId);
    return this.productRepo.listImagesForProduct(productId);
  }
}
