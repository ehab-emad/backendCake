"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketMessage = void 0;
class TicketMessage {
    constructor(id, ticketId, clientId, userId, message, createdAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.clientId = clientId;
        this.userId = userId;
        this.message = message;
        this.createdAt = createdAt;
    }
}
exports.TicketMessage = TicketMessage;
