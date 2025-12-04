import { AggregateRoot } from "./AggregateRoot";
import { DomainEvent } from "../events/DomainEvent";

export class HotelMeal extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly hotelId: string,
    public name: string
  ) {
    super();
  }

  public markAdded(): void {
    this.apply(new HotelMealAdded(this.id, this.hotelId, this.name));
  }

  public markRemoved(): void {
    this.apply(new HotelMealRemoved(this.id, this.hotelId));
  }
}

export class HotelMealAdded implements DomainEvent {
  public readonly occurredOn = new Date();
  constructor(
    public readonly mealId: string,
    public readonly hotelId: string,
    public readonly name: string
  ) {}
}

export class HotelMealRemoved implements DomainEvent {
  public readonly occurredOn = new Date();
  constructor(
    public readonly mealId: string,
    public readonly hotelId: string
  ) {}
}
