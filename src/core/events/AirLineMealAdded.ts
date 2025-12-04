import { DomainEvent } from "./DomainEvent";

export class AirLineMealAdded implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly type = "AirLineMealAdded";

  constructor(
    public readonly airLineId: string,
    public readonly mealId: string
  ) {
    this.occurredOn = new Date();
  }
}
