import { DomainEvent } from "./DomainEvent";

export class HotelImageRemoved extends DomainEvent {
  public readonly type = "HotelImageRemoved";
  
  constructor(
    public readonly hotelId: string,
    public readonly imageId: string
  ) {
    super();
  }
}