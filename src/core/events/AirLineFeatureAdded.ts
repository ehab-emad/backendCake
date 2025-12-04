import { DomainEvent } from "./DomainEvent";

export class AirLineFeatureAdded implements DomainEvent {
  public readonly occurredOn: Date;

  public readonly type = "AirLineFeatureAdded";

  constructor(
    public readonly airLineId: string,
    public readonly featureId: string
  ) {
    this.occurredOn = new Date();
  }
}
