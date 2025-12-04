"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
class Ticket {
    constructor(id, ticketNumber, title, status, createdAt) {
        this.id = id;
        this.ticketNumber = ticketNumber;
        this.title = title;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = new Date();
        this.attachments = [];
    }
}
exports.Ticket = Ticket;
