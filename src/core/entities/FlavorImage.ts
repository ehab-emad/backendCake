import { AggregateRoot } from "./AggregateRoot";

export class FlavorImage extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly flavorId: string,
    public readonly imageUrl: string
  ) {
    super();
  }
}
