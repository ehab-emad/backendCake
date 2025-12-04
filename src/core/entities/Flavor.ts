import { AggregateRoot } from "./AggregateRoot";
import { FlavorImage } from "./FlavorImage";

export class Flavor extends AggregateRoot {
  public images: FlavorImage[] = [];

  constructor(
    public readonly id: string,
    public name: string,
    public shapeId: string,
    public price: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    super();
  }

  addImage(img: FlavorImage): void {
    this.images.push(img);
    this.applyEventsFrom(img);
  }

  removeImage(imageId: string): void {
    this.images = this.images.filter((i) => i.id !== imageId);
    const marker = new FlavorImage(imageId, this.id, "");
    this.applyEventsFrom(marker);
  }

  private applyEventsFrom(ar: AggregateRoot) {
    for (const e of ar.pullEvents()) {
      this.apply(e);
    }
  }
}
