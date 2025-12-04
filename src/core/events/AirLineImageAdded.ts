import { DomainEvent } from "./DomainEvent";

export class AirLineImageAdded implements DomainEvent {
  public readonly occurredOn: Date;

  public readonly type = "AirLineImageAdded";

  constructor(
    public readonly airLineId: string,
    public readonly imageId: string
  ) {
    this.occurredOn = new Date();
  }
}
