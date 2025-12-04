import { DomainEvent } from "./DomainEvent";

export class ProductImageAdded implements DomainEvent {
  public readonly occurredOn = new Date();
  constructor(
    public readonly productId: string,
    public readonly imageId: string
  ) {}
}
