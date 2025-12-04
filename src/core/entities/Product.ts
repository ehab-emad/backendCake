import { AggregateRoot } from "./AggregateRoot";
import { ProductImage } from "./ProductImage";
import { ProductRating } from "./ProductRating";

export class Product extends AggregateRoot {
  public images: ProductImage[] = [];
  public ratings: ProductRating[] = [];
  
  constructor(
    public readonly id: string,
    public name: string,
    public clientId: string,
    public description: string,
    public fullDescription: string,
    public price: number,
    public stockQuantity: number = 0,
    public imageUrl?: string,
    public material?: string,
    public beads?: string,
    public length?: string,
    public weight?: string,
    public rating: number = 0,
    public sales: number = 0,
    public status: string = 'نشط',
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    super();
  }

  addImage(img: ProductImage): void {
    this.images.push(img);
    this.applyEventsFrom(img);
  }

  removeImage(imageId: string): void {
    this.images = this.images.filter((i) => i.id !== imageId);
    const marker = new ProductImage(imageId, this.id, "");
    this.applyEventsFrom(marker);
  }

  addRating(rtg: ProductRating): void {
    this.ratings.push(rtg);
    this.applyEventsFrom(rtg);
  }

  private applyEventsFrom(ar: AggregateRoot) {
    for (const e of ar.pullEvents()) {
      this.apply(e);
    }
  }
}
