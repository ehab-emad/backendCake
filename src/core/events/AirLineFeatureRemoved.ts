import { DomainEvent } from "./DomainEvent";

export class AirLineFeatureRemoved implements DomainEvent {
  public readonly occurredOn: Date;

  public readonly type = "AirLineFeatureRemoved";

  constructor(
    public readonly airLineId: string,
    public readonly featureId: string
  ) {
    this.occurredOn = new Date();
  }
}
