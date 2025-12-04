import { AggregateRoot } from "./AggregateRoot";

export class ProductRating extends AggregateRoot {
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    public id: string,
    public productId: string,
    public name: string,
    public comment: string = '',
    public rating: number,
    public images: string[] = [],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super();
    const now = new Date();
    this.createdAt = createdAt || now;
    this.updatedAt = updatedAt || now;
  }
}
