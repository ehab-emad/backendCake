import { AggregateRoot } from "./AggregateRoot";
import { DomainEvent } from "../events/DomainEvent";

export class HotelAmenity extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly hotelId: string,
    public name: string
  ) {
    super();
  }

  public markAdded(): void {
    this.apply(new HotelAmenityAdded(this.id, this.hotelId, this.name));
  }

  public markRemoved(): void {
    this.apply(new HotelAmenityRemoved(this.id, this.hotelId));
  }
}

export class HotelAmenityAdded implements DomainEvent {
  public readonly occurredOn = new Date();
  constructor(
    public readonly amenityId: string,
    public readonly hotelId: string,
    public readonly name: string
  ) {}
}

export class HotelAmenityRemoved implements DomainEvent {
  public readonly occurredOn = new Date();
  constructor(
    public readonly amenityId: string,
    public readonly hotelId: string
  ) {}
}
