"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketMessageRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const TicketMessage_model_1 = require("../models/TicketMessage.model");
const TicketMessage_1 = require("../../../core/entities/TicketMessage");
let TicketMessageRepository = class TicketMessageRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized)
            throw new Error("DS not inited");
        return database_config_1.AppDataSource.getRepository(TicketMessage_model_1.TicketMessageEntity);
    }
    create(m) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save({
                id: m.id,
                ticket_id: m.ticketId,
                client_id: m.clientId,
                user_id: m.userId,
                message: m.message,
                created_at: m.createdAt,
            });
        });
    }
    findByTicket(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({
                where: { ticket_id: ticketId },
                order: { created_at: "ASC" },
            });
            return ents.map((e) => new TicketMessage_1.TicketMessage(e.id, e.ticket_id, e.client_id, e.user_id, e.message, e.created_at));
        });
    }
};
exports.TicketMessageRepository = TicketMessageRepository;
exports.TicketMessageRepository = TicketMessageRepository = __decorate([
    (0, inversify_1.injectable)()
], TicketMessageRepository);
