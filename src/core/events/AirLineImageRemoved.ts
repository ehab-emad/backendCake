import { DomainEvent } from "./DomainEvent";

export class AirLineImageRemoved implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly type = "AirLineImageRemoved";

  constructor(
    public readonly airLineId: string,
    public readonly imageId: string
  ) {
    this.occurredOn = new Date();
  }
}
