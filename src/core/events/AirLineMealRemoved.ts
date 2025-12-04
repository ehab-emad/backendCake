import { DomainEvent } from "./DomainEvent";

export class AirLineMealRemoved implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly type = "AirLineMealRemoved";

  constructor(
    public readonly airLineId: string,
    public readonly mealId: string
  ) {
    this.occurredOn = new Date();
  }
}
