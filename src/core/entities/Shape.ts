import { AggregateRoot } from "./AggregateRoot";
import { ShapeImage } from "./ShapeImage";

export class Shape extends AggregateRoot {
  public images: ShapeImage[] = [];

  constructor(
    public readonly id: string,
    public name: string,
    public numberOfPeople: number,
    public weight: number,
    public width: number,
    public height: number,
    public price: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    super();
  }

  addImage(img: ShapeImage): void {
    this.images.push(img);
    this.applyEventsFrom(img);
  }

  removeImage(imageId: string): void {
    this.images = this.images.filter((i) => i.id !== imageId);
    const marker = new ShapeImage(imageId, this.id, "");
    this.applyEventsFrom(marker);
  }

  private applyEventsFrom(ar: AggregateRoot) {
    for (const e of ar.pullEvents()) {
      this.apply(e);
    }
  }
}
