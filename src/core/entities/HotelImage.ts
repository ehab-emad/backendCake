import { HotelImageAdded } from "../events/hotelimageAdded";
import { HotelImageRemoved } from "../events/HotelImageRemoved";
import { AggregateRoot } from "./AggregateRoot";


export class HotelImage extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly hotelId: string,
    public readonly path: string
  ) {
    super();
  }

  public markAdded(): void {
    this.apply(new HotelImageAdded(this.hotelId, this.id));
  }

  public markRemoved(): void {
    this.apply(new HotelImageRemoved(this.hotelId, this.id));
  }
}
