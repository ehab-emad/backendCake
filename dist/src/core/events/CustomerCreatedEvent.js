"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerCreatedEvent = void 0;
const DomainEvent_1 = require("./DomainEvent");
class CustomerCreatedEvent extends DomainEvent_1.DomainEvent {
    constructor(customerId, authUserId) {
        super();
        this.customerId = customerId;
        this.authUserId = authUserId;
        this.type = "CustomerCreated";
    }
}
exports.CustomerCreatedEvent = CustomerCreatedEvent;
