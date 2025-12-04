import { ProductRating } from "../../../core/entities/ProductRating";

export interface IProductRatingRepository {
  create(rating: ProductRating): Promise<void>;
  listForProduct(productId: string): Promise<ProductRating[]>;
  removeById(ratingId: string): Promise<void>;
}
