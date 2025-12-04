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
exports.TicketEntity = void 0;
const typeorm_1 = require("typeorm");
const TicketAttachment_model_1 = require("./TicketAttachment.model");
const TicketMessage_model_1 = require("./TicketMessage.model");
let TicketEntity = class TicketEntity {
};
exports.TicketEntity = TicketEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], TicketEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 64 }),
    __metadata("design:type", String)
], TicketEntity.prototype, "ticket_number", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 255 }),
    __metadata("design:type", String)
], TicketEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["open", "pending", "closed"],
        default: "open",
    }),
    __metadata("design:type", String)
], TicketEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp" }),
    __metadata("design:type", Date)
], TicketEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp" }),
    __metadata("design:type", Date)
], TicketEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TicketAttachment_model_1.TicketAttachmentEntity, (attachment) => attachment.ticket, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], TicketEntity.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TicketMessage_model_1.TicketMessageEntity, (msg) => msg.ticket, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], TicketEntity.prototype, "messages", void 0);
exports.TicketEntity = TicketEntity = __decorate([
    (0, typeorm_1.Entity)("tickets")
], TicketEntity);
