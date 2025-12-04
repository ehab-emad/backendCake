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
exports.SummaryService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const date_fns_1 = require("date-fns");
let SummaryService = class SummaryService {
    constructor(reservations, payments) {
        this.reservations = reservations;
        this.payments = payments;
    }
    getSummary(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { period } = filters;
            const now = new Date();
            let start, end = now;
            switch (period) {
                case "current_week":
                    start = (0, date_fns_1.startOfWeek)(now);
                    break;
                case "current_month":
                    start = (0, date_fns_1.startOfMonth)(now);
                    break;
                case "past_month":
                    start = (0, date_fns_1.startOfMonth)((0, date_fns_1.sub)(now, { months: 1 }));
                    end = (0, date_fns_1.endOfMonth)((0, date_fns_1.sub)(now, { months: 1 }));
                    break;
                case "current_year":
                    start = (0, date_fns_1.startOfYear)(now);
                    break;
                case "past_year":
                    start = (0, date_fns_1.startOfYear)((0, date_fns_1.sub)(now, { years: 1 }));
                    end = (0, date_fns_1.endOfMonth)((0, date_fns_1.sub)(now, { months: now.getMonth() + 1 }));
                    break;
                default:
                    start = (0, date_fns_1.startOfMonth)(now);
            }
            // const numTrips = await this.trips.countCreatedBetween(start, end);
            const activeReservations = yield this.reservations.countByStatusesBetween(["pending", "confirmed"], start, end);
            const totalRevenue = yield this.payments.sumByStatusBetween(["paid"], start, end);
            return { activeReservations, totalRevenue };
        });
    }
};
exports.SummaryService = SummaryService;
exports.SummaryService = SummaryService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ReservationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.PaymentRepository)),
    __metadata("design:paramtypes", [Object, Object])
], SummaryService);
