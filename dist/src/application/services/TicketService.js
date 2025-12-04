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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.TicketService = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const Ticket_1 = require("../../core/entities/Ticket");
const types_1 = require("../../shared/di/types");
let TicketService = class TicketService {
    constructor(repo) {
        this.repo = repo;
    }
    createTicket(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            const now = new Date();
            const ticketNumber = `TICK-${Date.now()}`;
            const ticket = new Ticket_1.Ticket(id, ticketNumber, dto.title, dto.status, now);
            ticket.updatedAt = now;
            yield this.repo.create(ticket);
            if (dto.attachments) {
                for (const path of dto.attachments) {
                    yield this.repo.addAttachment(id, path, (0, uuid_1.v4)());
                }
            }
            const created = yield this.repo.findById(id);
            if (!created)
                throw new Error("Failed to load created ticket");
            return created;
        });
    }
    listTickets(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.findAll(clientId);
        });
    }
    getTicket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield this.repo.findById(id);
            if (!t)
                throw new Error("Ticket not found");
            return t;
        });
    }
    updateTicket(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield this.repo.findById(id);
            if (!t)
                throw new Error("Ticket not found");
            if (dto.title !== undefined)
                t.title = dto.title;
            if (dto.status !== undefined)
                t.status = dto.status;
            t.updatedAt = new Date();
            yield this.repo.update(t);
            if (dto.newAttachments) {
                for (const path of dto.newAttachments) {
                    yield this.repo.addAttachment(id, path, (0, uuid_1.v4)());
                }
            }
            const updated = yield this.repo.findById(id);
            if (!updated)
                throw new Error("Failed to load updated ticket");
            return updated;
        });
    }
    deleteTicket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
};
exports.TicketService = TicketService;
exports.TicketService = TicketService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TicketRepository)),
    __metadata("design:paramtypes", [Object])
], TicketService);
