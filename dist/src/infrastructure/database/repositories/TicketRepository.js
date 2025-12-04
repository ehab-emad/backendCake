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
exports.TicketRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Ticket_model_1 = require("../models/Ticket.model");
const TicketAttachment_model_1 = require("../models/TicketAttachment.model");
const Ticket_1 = require("../../../core/entities/Ticket");
let TicketRepository = class TicketRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized)
            throw new Error("DS not initialized");
        return database_config_1.AppDataSource.getRepository(Ticket_model_1.TicketEntity);
    }
    get attRepo() {
        return database_config_1.AppDataSource.getRepository(TicketAttachment_model_1.TicketAttachmentEntity);
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const e = yield this.repo.findOne({
                where: { id },
                relations: ["attachments"],
            });
            if (!e)
                return null;
            const t = new Ticket_1.Ticket(e.id, e.ticket_number, e.title, e.status, e.created_at);
            t.updatedAt = e.updated_at;
            t.attachments = e.attachments.map((a) => ({
                id: a.id,
                path: a.path,
                createdAt: a.created_at,
            }));
            return t;
        });
    }
    findAll(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = this.repo
                .createQueryBuilder("ticket")
                .leftJoinAndSelect("ticket.attachments", "attachment");
            if (clientId) {
                qb.innerJoin("ticket.messages", "message", "message.client_id = :clientId", { clientId });
            }
            // execute
            const es = yield qb.getMany();
            return es.map((e) => {
                const t = new Ticket_1.Ticket(e.id, e.ticket_number, e.title, e.status, e.created_at);
                t.updatedAt = e.updated_at;
                t.attachments = e.attachments.map((a) => ({
                    id: a.id,
                    path: a.path,
                    createdAt: a.created_at,
                }));
                return t;
            });
        });
    }
    create(t) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save({
                id: t.id,
                ticket_number: t.ticketNumber,
                title: t.title,
                status: t.status,
                created_at: t.createdAt,
                updatedAt: t.updatedAt,
            });
        });
    }
    update(t) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save({
                id: t.id,
                ticket_number: t.ticketNumber,
                title: t.title,
                status: t.status,
                created_at: t.createdAt,
                updatedAt: t.updatedAt,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    addAttachment(ticketId, path, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.attRepo.save({ id, ticket_id: ticketId, path });
        });
    }
};
exports.TicketRepository = TicketRepository;
exports.TicketRepository = TicketRepository = __decorate([
    (0, inversify_1.injectable)()
], TicketRepository);
