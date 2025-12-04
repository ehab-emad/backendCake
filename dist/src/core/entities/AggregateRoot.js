"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
class AggregateRoot {
    constructor() {
        this.domainEvents = [];
    }
    apply(event) {
        this.domainEvents.push(event);
    }
    pullEvents() {
        const events = this.domainEvents;
        this.domainEvents = [];
        return events;
    }
}
exports.AggregateRoot = AggregateRoot;
