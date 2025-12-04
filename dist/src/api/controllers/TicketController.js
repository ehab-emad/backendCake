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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const inversify_1 = require("inversify");
const multer_1 = __importDefault(require("multer"));
const validation_middleware_1 = require("../middleware/validation.middleware");
const types_1 = require("../../shared/di/types");
const TicketService_1 = require("../../application/services/TicketService");
const TicketMessageService_1 = require("../../application/services/TicketMessageService");
const CreateTicket_dto_1 = require("../../application/dto/CreateTicket.dto");
const UpdateTicket_dto_1 = require("../../application/dto/UpdateTicket.dto");
let TicketController = class TicketController {
    constructor(ticketSvc, msgSvc) {
        this.ticketSvc = ticketSvc;
        this.msgSvc = msgSvc;
        this.upload = (0, multer_1.default)({ dest: "uploads/tickets/" });
        this.create = [
            this.upload.array("attachments", 10),
            (0, validation_middleware_1.validationMiddleware)(CreateTicket_dto_1.CreateTicketSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    const dto = CreateTicket_dto_1.CreateTicketSchema.parse(req.body);
                    const files = req.files || [];
                    if (files.length) {
                        dto.attachments = files.map((f) => f.path);
                    }
                    const ticket = yield this.ticketSvc.createTicket(dto);
                    yield this.msgSvc.addMessage(ticket.id, (_a = dto.clientId) !== null && _a !== void 0 ? _a : null, (_b = dto.userId) !== null && _b !== void 0 ? _b : null, dto.message);
                    const history = yield this.msgSvc.listMessages(ticket.id);
                    res.status(201).json(Object.assign(Object.assign({}, ticket), { messages: history }));
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.list = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = req.query.clientId;
                const tickets = yield this.ticketSvc.listTickets(clientId);
                const enriched = yield Promise.all(tickets.map((t) => __awaiter(this, void 0, void 0, function* () {
                    return (Object.assign(Object.assign({}, t), { messages: yield this.msgSvc.listMessages(t.id) }));
                })));
                res.json(enriched);
            }
            catch (err) {
                next(err);
            }
        });
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketSvc.getTicket(req.params.id);
                const history = yield this.msgSvc.listMessages(ticket.id);
                res.json(Object.assign(Object.assign({}, ticket), { messages: history }));
            }
            catch (err) {
                next(err);
            }
        });
        this.update = [
            this.upload.array("newAttachments", 10),
            (0, validation_middleware_1.validationMiddleware)(UpdateTicket_dto_1.UpdateTicketSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    const dto = UpdateTicket_dto_1.UpdateTicketSchema.parse(req.body);
                    const files = req.files || [];
                    if (files.length) {
                        dto.newAttachments = files.map((f) => f.path);
                    }
                    const updated = yield this.ticketSvc.updateTicket(req.params.id, dto);
                    if (dto.message) {
                        yield this.msgSvc.addMessage(updated.id, (_a = dto.clientId) !== null && _a !== void 0 ? _a : null, (_b = dto.userId) !== null && _b !== void 0 ? _b : null, dto.message);
                    }
                    const history = yield this.msgSvc.listMessages(updated.id);
                    res.json(Object.assign(Object.assign({}, updated), { messages: history }));
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ticketSvc.deleteTicket(req.params.id);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
    }
};
exports.TicketController = TicketController;
exports.TicketController = TicketController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TicketService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TicketMessageService)),
    __metadata("design:paramtypes", [TicketService_1.TicketService,
        TicketMessageService_1.TicketMessageService])
], TicketController);
