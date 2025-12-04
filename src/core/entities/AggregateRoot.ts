import { DomainEvent } from "../events/DomainEvent";

export abstract class AggregateRoot {
  private domainEvents: DomainEvent[] = [];

  protected apply(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public pullEvents(): DomainEvent[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }
}
