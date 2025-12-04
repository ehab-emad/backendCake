"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketMessageEntity = void 0;
const typeorm_1 = require("typeorm");
const Ticket_model_1 = require("./Ticket.model");
const Client_model_1 = require("./Client.model");
const Auth_model_1 = require("./Auth.model");
let TicketMessageEntity = class TicketMessageEntity {
};
exports.TicketMessageEntity = TicketMessageEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], TicketMessageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], TicketMessageEntity.prototype, "ticket_id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36, nullable: true }),
    __metadata("design:type", Object)
], TicketMessageEntity.prototype, "client_id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36, nullable: true }),
    __metadata("design:type", Object)
], TicketMessageEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], TicketMessageEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], TicketMessageEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ticket_model_1.TicketEntity, (ticket) => ticket.messages, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "ticket_id" }),
    __metadata("design:type", Ticket_model_1.TicketEntity)
], TicketMessageEntity.prototype, "ticket", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_model_1.ClientEntity, (c) => c.id, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "client_id" }),
    __metadata("design:type", Object)
], TicketMessageEntity.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Auth_model_1.AuthEntity, (a) => a.id, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", Object)
], TicketMessageEntity.prototype, "user", void 0);
exports.TicketMessageEntity = TicketMessageEntity = __decorate([
    (0, typeorm_1.Entity)("ticket_messages")
], TicketMessageEntity);
