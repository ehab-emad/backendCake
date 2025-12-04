import { DomainEvent } from "./DomainEvent";

export class HotelImageAdded extends DomainEvent {
  public readonly type = "HotelImageAdded";
  
  constructor(
    public readonly hotelId: string,
    public readonly imageId: string
  ) {
    super();
  }
}