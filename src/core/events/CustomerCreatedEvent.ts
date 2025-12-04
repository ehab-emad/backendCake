import { DomainEvent } from "./DomainEvent";

export class CustomerCreatedEvent extends DomainEvent {
  public readonly type = "CustomerCreated";

  constructor(
    public readonly customerId: string,
    public readonly authUserId: string
  ) {
    super();
  }
}
