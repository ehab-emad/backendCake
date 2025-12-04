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
exports.PaymentRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Payment_model_1 = require("../models/Payment.model");
const Payment_1 = require("../../../core/entities/Payment");
let PaymentRepository = class PaymentRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized) {
            throw new Error("DataSource not initialized");
        }
        return database_config_1.AppDataSource.getRepository(Payment_model_1.PaymentEntity);
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const e = yield this.repo.findOneBy({ id });
            if (!e)
                return null;
            return new Payment_1.Payment(e.id, e.process_number, e.reservation_id, e.customer_id, e.client_id, e.category, e.transaction_status, Number(e.amount), e.created_at);
        });
    }
    findByReservationId(reservationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.repo.find({
                where: { reservation_id: reservationId },
                order: { created_at: 'DESC' }
            });
            return entities.map(e => new Payment_1.Payment(e.id, e.process_number, e.reservation_id, e.customer_id, e.client_id, e.category, e.transaction_status, Number(e.amount), e.created_at));
        });
    }
    findByProcessNumber(processNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const e = yield this.repo.findOneBy({ process_number: processNumber });
            if (!e)
                return null;
            return new Payment_1.Payment(e.id, e.process_number, e.reservation_id, e.customer_id, e.client_id, e.category, e.transaction_status, Number(e.amount), e.created_at);
        });
    }
    findAndCount(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let qb = this.repo.createQueryBuilder("p");
            if (filters.clientId) {
                qb = qb.where("p.client_id = :clientId", {
                    clientId: filters.clientId,
                });
            }
            if (filters.reservationId) {
                qb = qb.andWhere("p.reservation_id = :reservationId", {
                    reservationId: filters.reservationId,
                });
            }
            if (filters.status) {
                qb = qb.andWhere("p.transaction_status = :status", {
                    status: filters.status,
                });
            }
            if (filters.minAmount !== undefined) {
                qb = qb.andWhere("p.amount >= :min", { min: filters.minAmount });
            }
            if (filters.maxAmount !== undefined) {
                qb = qb.andWhere("p.amount <= :max", { max: filters.maxAmount });
            }
            if (filters.fromDate) {
                qb = qb.andWhere("p.created_at >= :from", {
                    from: filters.fromDate,
                });
            }
            if (filters.toDate) {
                qb = qb.andWhere("p.created_at <= :to", {
                    to: filters.toDate,
                });
            }
            const page = (_a = filters.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = filters.limit) !== null && _b !== void 0 ? _b : 20;
            qb = qb
                .orderBy("p.created_at", "DESC")
                .skip((page - 1) * limit)
                .take(limit);
            const [entities, total] = yield qb.getManyAndCount();
            const payments = entities.map((e) => new Payment_1.Payment(e.id, e.process_number, e.reservation_id, e.customer_id, e.client_id, e.category, e.transaction_status, Number(e.amount), e.created_at));
            return [payments, total];
        });
    }
    sumByStatusBetween(statuses, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const row = yield this.repo
                .createQueryBuilder("p")
                .select("SUM(p.amount)", "total")
                .where("p.transaction_status IN (:...statuses)", { statuses })
                .andWhere("p.created_at BETWEEN :start AND :end", { start, end })
                .getRawOne();
            const totalStr = (_a = row === null || row === void 0 ? void 0 : row.total) !== null && _a !== void 0 ? _a : "0";
            return parseFloat(totalStr);
        });
    }
    create(p) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.insert({
                id: p.id,
                process_number: p.processNumber,
                reservation_id: p.reservationId,
                customer_id: p.customerId,
                client_id: p.clientId,
                category: p.category,
                transaction_status: p.transactionStatus,
                amount: p.amount.toString(),
            });
        });
    }
    update(p) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.update(p.id, {
                reservation_id: p.reservationId,
                customer_id: p.customerId,
                client_id: p.clientId,
                category: p.category,
                transaction_status: p.transactionStatus,
                amount: p.amount.toString(),
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
};
exports.PaymentRepository = PaymentRepository;
exports.PaymentRepository = PaymentRepository = __decorate([
    (0, inversify_1.injectable)()
], PaymentRepository);
