import { Product } from "../../core/entities/Product";
import { ProductRating } from "../../core/entities/ProductRating";
import { ProductImage } from "../../core/entities/ProductImage";
import { FilterProductDTO } from "../../../application/dto/FilterProduct.dto";

export interface IProductRepository {
  create(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  listProducts(filters: FilterProductDTO): Promise<{ data: Product[]; total: number }>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  addRating(productId: string, rating: ProductRating): Promise<void>;
  removeImage(imageId: string): Promise<void>;
  listImagesForProduct(productId: string): Promise<ProductImage[]>;
}
