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
exports.ReservationController = void 0;
const inversify_1 = require("inversify");
const validation_middleware_1 = require("../middleware/validation.middleware");
const types_1 = require("../../shared/di/types");
const CreateReservation_dto_1 = require("../../application/dto/CreateReservation.dto");
const UpdateReservation_dto_1 = require("../../application/dto/UpdateReservation.dto");
const FilterReservation_dto_1 = require("../../application/dto/FilterReservation.dto");
const PaymentService_1 = require("../../application/services/PaymentService");
const CustomerService_1 = require("../../application/services/CustomerService");
const ClientService_1 = require("../../application/services/ClientService");
const ReservationPaymentService_1 = __importDefault(require("../../application/services/ReservationPaymentService"));
function determineCategory(obj) {
    return null;
}
let ReservationController = class ReservationController {
    constructor(svc, clientService, customerService, paymentService, reservationPaymentService, authRepo) {
        this.svc = svc;
        this.clientService = clientService;
        this.customerService = customerService;
        this.paymentService = paymentService;
        this.reservationPaymentService = reservationPaymentService;
        this.authRepo = authRepo;
        this.create = [
            (0, validation_middleware_1.validationMiddleware)(CreateReservation_dto_1.CreateReservationSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const dto = CreateReservation_dto_1.CreateReservationSchema.parse(req.body);
                    // Create reservation with pending status only
                    const reservation = yield this.svc.createReservationOnly(dto);
                    // const Customer = await this.customerService.findById(dto.customerId);
                    // Get related entities for response
                    let room = null;
                    let flight = null;
                    let trip = null;
                    if (dto.serviceType === 'room' && dto.serviceId) {
                        throw new Error('Room service is not supported');
                    }
                    else if (dto.serviceType === 'flight' && dto.serviceId) {
                        throw new Error('Flight service is not supported');
                    }
                    else if (dto.serviceType === 'trip' && dto.serviceId) {
                        throw new Error('Trip service is not supported');
                    }
                    const category = determineCategory({});
                    // Build the response
                    const response = Object.assign(Object.assign({}, reservation), { room: null, flight: null, 
                        // Customer,
                        trip: null, category });
                    res.status(201).json(response);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.list = [
            (0, validation_middleware_1.validationMiddleware)(FilterReservation_dto_1.FilterReservationSchema, "query"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { data: raw, total, page, limit, } = yield this.svc.listReservations(FilterReservation_dto_1.FilterReservationSchema.parse(req.query));
                    const paymentsByRes = new Map();
                    yield Promise.all(raw.map((r) => __awaiter(this, void 0, void 0, function* () {
                        const { data: ps } = yield this.paymentService.listPayments({
                            reservationId: r.id,
                            page: 1,
                            limit: 1,
                        });
                        if (ps[0])
                            paymentsByRes.set(r.id, ps[0]);
                    })));
                    const results = yield Promise.all(raw.map((r) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c;
                        try {
                            const cust = yield this.customerService.findById((_a = r === null || r === void 0 ? void 0 : r.customer) === null || _a === void 0 ? void 0 : _a.id);
                            const au = yield this.authRepo.findById(cust.authUserId);
                            const customerWithAuth = Object.assign(Object.assign({}, cust), { authUser: au && {
                                    id: au.id,
                                    firstName: au.firstName,
                                    lastName: au.lastName,
                                    email: au.email,
                                    phoneNumber: (_b = au.phoneNumber) !== null && _b !== void 0 ? _b : null,
                                } });
                            const category = determineCategory({});
                            const client = yield this.clientService.getClient(r.client.id);
                            return {
                                id: r.id,
                                reservationNumber: r.reservationNumber,
                                status: r.status,
                                fromDate: r.fromDate,
                                toDate: r.toDate,
                                departureDate: r.departureDate || null,
                                returnDate: r.returnDate || null,
                                adult: r.adult,
                                children: r.children,
                                seats: r.seats,
                                mainFlightSeats: r.mainFlightSeats,
                                returnFlightSeats: r.returnFlightSeats,
                                transitFlightSeats: r.transitFlightSeats,
                                baggage: r.baggage,
                                meals: r.meals,
                                extraBaggage: r.extraBaggage,
                                airportTransfer: r.airportTransfer,
                                unlimitedInternet: r.unlimitedInternet,
                                extras: r.extras,
                                customerWithAuth,
                                client,
                                room: null,
                                flight: null,
                                trip: null,
                                category,
                                payment: (_c = paymentsByRes.get(r.id)) !== null && _c !== void 0 ? _c : null,
                            };
                        }
                        catch (error) {
                            console.error(`Error processing reservation ${r.id}:`, error);
                            return null;
                        }
                    })));
                    const data = results.filter((r) => r !== null);
                    res.json({ data, total, page, limit });
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const r = yield this.svc.get(req.params.id);
                const client = yield this.clientService.getClient(r.clientId);
                const cust = yield this.customerService.findById(r.customerId);
                const au = yield this.authRepo.findById(cust.authUserId);
                const customerWithAuth = Object.assign(Object.assign({}, cust), { authUser: au && {
                        id: au.id,
                        firstName: au.firstName,
                        lastName: au.lastName,
                        email: au.email,
                        phoneNumber: (_a = au.phoneNumber) !== null && _a !== void 0 ? _a : null,
                    } });
                const room = null;
                let flight = null;
                const trip = null;
                const category = determineCategory({});
                const { data: ps } = yield this.paymentService.listPayments({
                    reservationId: r.id,
                    page: 1,
                    limit: 1,
                });
                const payment = (_b = ps[0]) !== null && _b !== void 0 ? _b : null;
                res.json({
                    id: r.id,
                    reservationNumber: r.reservationNumber,
                    status: r.status,
                    fromDate: r.fromDate,
                    toDate: r.toDate,
                    departureDate: r.departureDate || null,
                    returnDate: r.returnDate || null,
                    adult: r.adult,
                    children: r.children,
                    seats: r.seats,
                    mainFlightSeats: r.mainFlightSeats,
                    returnFlightSeats: r.returnFlightSeats,
                    transitFlightSeats: r.transitFlightSeats,
                    baggage: r.baggage,
                    meals: r.meals,
                    extraBaggage: r.extraBaggage,
                    airportTransfer: r.airportTransfer,
                    unlimitedInternet: r.unlimitedInternet,
                    extras: r.extras,
                    customerWithAuth,
                    client,
                    room,
                    flight,
                    trip,
                    category,
                    payment,
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.update = [
            (0, validation_middleware_1.validationMiddleware)(UpdateReservation_dto_1.UpdateReservationSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const dto = UpdateReservation_dto_1.UpdateReservationSchema.parse(req.body);
                    const base = yield this.svc.update(req.params.id, dto);
                    const room = null;
                    const flight = null;
                    const trip = null;
                    const category = determineCategory({});
                    const { data: payments } = yield this.paymentService.listPayments({
                        reservationId: base.id,
                        page: 1,
                        limit: 1,
                    });
                    const payment = payments.length > 0 ? payments[0] : null;
                    res.json(Object.assign(Object.assign({}, base), { room,
                        flight,
                        trip,
                        category,
                        payment }));
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.delete(req.params.id);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
        // Handle payment callbacks (success/failure)
        this.handlePaymentWebhook = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { gateway } = req.params;
                if (!['stripe', 'tamara', 'mimo'].includes(gateway)) {
                    return res.status(400).json({ error: 'Unsupported payment gateway' });
                }
                // Process the webhook
                yield this.reservationPaymentService.handlePaymentWebhook(gateway, req.body);
                // Acknowledge receipt of the webhook
                res.status(200).json({ received: true });
            }
            catch (err) {
                console.error('Error processing payment webhook:', err);
                next(err);
            }
        });
        this.cancelReservation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const reservation = yield this.reservationPaymentService.cancelReservation(id);
                res.json({
                    success: true,
                    reservationId: reservation.id,
                    status: reservation.status,
                    paymentStatus: reservation.paymentStatus
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
};
exports.ReservationController = ReservationController;
exports.ReservationController = ReservationController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IReservationService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ClientService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CustomerService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.PaymentService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ReservationPaymentService)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.AuthRepository)),
    __metadata("design:paramtypes", [Object, ClientService_1.ClientService,
        CustomerService_1.CustomerService,
        PaymentService_1.PaymentService,
        ReservationPaymentService_1.default, Object])
], ReservationController);
