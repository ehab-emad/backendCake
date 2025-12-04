import { AggregateRoot } from "./AggregateRoot";
import { HotelImage } from "./HotelImage";
import { HotelAmenity } from "./HotelAmenity";
import { HotelRating } from "./HotelRating";

export class Hotel extends AggregateRoot {
  public images: HotelImage[] = [];
  public amenities: HotelAmenity[] = [];
public ratings: HotelRating[] = [];
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public status: boolean,
    public rating: number = 0,
    public price: number = 0,
    public name: string,
    public branchName: string,
    public contactNumber: string,
    public contactPerson: string,
   

    public country?: string,
    public city?: string,
    public address?: string,
    public description?: string,

   
    public commissionRate?: number,
    // public contractDuration?: number,

    public contractStartDate?: Date,
    public contractEndDate?: Date,
    


    public generalAmenities?: string,
    public diningAmenities?: string,
    public wellnessAmenities?: string,
    public businessAmenities?: string,
    public otherAmenities?: string,
    public map?: string,

    // Geo
    public latitude?: number,
    public longitude?: number,

    
  public imageUrls?: string[],
  public meals?: Array<{ name?: string; totalPrice: number }>,
  public unlimitedInternet?: Array<{ name?: string; totalPrice: number }>,
  public airportTransfer?: Array<{ name?: string; totalPrice: number }>,
  public readonly createdAt?: Date,
  public readonly updatedAt?: Date,
  ) {
    super();
  }

  addImage(img: HotelImage): void {
    this.images.push(img);
    img.markAdded();
    this.applyEventsFrom(img);
  }

  removeImage(imageId: string): void {
    this.images = this.images.filter((i) => i.id !== imageId);
    const marker = new HotelImage(imageId, this.id, "");
    marker.markRemoved();
    this.applyEventsFrom(marker);
  }

  addAmenity(a: HotelAmenity): void {
    this.amenities.push(a);
    a.markAdded();
    this.applyEventsFrom(a);
  }

  removeAmenity(amenityId: string): void {
    this.amenities = this.amenities.filter((a) => a.id !== amenityId);
    const marker = new HotelAmenity(amenityId, this.id, "");
    marker.markRemoved();
    this.applyEventsFrom(marker);
  }

  private applyEventsFrom(ar: AggregateRoot) {
    for (const e of ar.pullEvents()) {
      this.apply(e);
    }
  }
}
