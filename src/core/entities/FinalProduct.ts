import { AggregateRoot } from "./AggregateRoot";

export class FinalProduct extends AggregateRoot {
  constructor(
    public readonly id: string,
    public maskId: string,
    public name: string,
    public price: number,
    public category: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    super();
  }
}
