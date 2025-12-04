import { AggregateRoot } from "./AggregateRoot";

export class MaskImage extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly maskId: string,
    public readonly imageUrl: string
  ) {
    super();
  }
}
