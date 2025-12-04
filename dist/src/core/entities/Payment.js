"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
class Payment {
    constructor(id, processNumber, reservationId, customerId, clientId, category, transactionStatus, amount, createdAt) {
        this.id = id;
        this.processNumber = processNumber;
        this.reservationId = reservationId;
        this.customerId = customerId;
        this.clientId = clientId;
        this.category = category;
        this.transactionStatus = transactionStatus;
        this.amount = amount;
        this.createdAt = createdAt;
    }
}
exports.Payment = Payment;
