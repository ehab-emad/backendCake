import { AggregateRoot } from "./AggregateRoot";

export class ShapeImage extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly shapeId: string,
    public readonly imageUrl: string
  ) {
    super();
  }
}
