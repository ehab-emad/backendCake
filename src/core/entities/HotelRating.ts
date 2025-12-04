export class HotelRating {
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    public id: string,
    public hotelId: string,
    public name: string,
    public comment: string = '',
    public rating: number,
    public images: string[] = [],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    const now = new Date();
    this.createdAt = createdAt || now;
    this.updatedAt = updatedAt || now;
  }
}
