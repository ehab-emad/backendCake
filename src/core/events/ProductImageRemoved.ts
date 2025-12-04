import { DomainEvent } from "./DomainEvent";

export class ProductImageRemoved implements DomainEvent {
  public readonly occurredOn = new Date();
  constructor(
    public readonly productId: string,
    public readonly imageId: string
  ) {}
}
