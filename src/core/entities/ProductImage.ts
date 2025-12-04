import { ProductImageAdded } from "../events/ProductImageAdded";
import { ProductImageRemoved } from "../events/ProductImageRemoved";
import { AggregateRoot } from "./AggregateRoot";


export class ProductImage extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly path: string
  ) {
    super();
  }

  public markAdded(): void {
    this.apply(new ProductImageAdded(this.productId, this.id));
  }

  public markRemoved(): void {
    this.apply(new ProductImageRemoved(this.productId, this.id));
  }
}
