import { ProductImage } from "../../../core/entities/ProductImage";

export interface IProductImageRepository {
  create(image: ProductImage): Promise<void>;
  listForProduct(productId: string): Promise<ProductImage[]>;
  removeById(imageId: string): Promise<void>;
}
