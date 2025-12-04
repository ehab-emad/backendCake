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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const Reservation_1 = require("../../core/entities/Reservation");
const ClientService_1 = require("./ClientService");
const CustomerService_1 = require("./CustomerService");
// import { RoomService } from "./RoomService";
// import { FlightService } from "./FlightService";
// import { TripService } from "./TripService";
const NotificationService_1 = require("./NotificationService");
const PaymentService_1 = require("./PaymentService");
const ReservationPaymentService_1 = require("./ReservationPaymentService");
const types_1 = require("../../shared/di/types");
let ReservationService = class ReservationService {
    constructor(repo, paymentRepo, paymentService, reservationPaymentService, clientService, customerService, notificationService) {
        this.repo = repo;
        this.paymentRepo = paymentRepo;
        this.paymentService = paymentService;
        this.reservationPaymentService = reservationPaymentService;
        this.clientService = clientService;
        this.customerService = customerService;
        this.notificationService = notificationService;
    }
    createReservationOnly(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract seat arrays
            const seatNumbers = dto.seat
                ? (Array.isArray(dto.seat) ? dto.seat : [dto.seat])
                : [];
            const id = (0, uuid_1.v4)();
            const reservation = new Reservation_1.Reservation(id, `RES-${Date.now()}`, 'pending', // status
            'pending', // paymentStatus
            dto.clientId, dto.customerId, null, // roomId is no longer supported
            null, // flightId is no longer supported
            null, // tripId is no longer supported
            dto.fromDate || null, dto.toDate || null, dto.adult || null, dto.children || null, dto.infant || 0, dto.rooms || 1, dto.price || 0, seatNumbers, [], // mainFlightSeats is no longer supported
            [], // transitFlightSeats is no longer supported
            [], // returnFlightSeats is no longer supported
            dto.baggage || null, dto.meals && dto.meals.length > 0 ? dto.meals[0] : null, dto.extraBaggage && dto.extraBaggage.length > 0 ? dto.extraBaggage[0] : null, dto.airportTransfer && dto.airportTransfer.length > 0 ? dto.airportTransfer[0] : null, dto.unlimitedInternet && dto.unlimitedInternet.length > 0 ? dto.unlimitedInternet[0] : null, dto.extras, dto.name, dto.email, dto.gender, dto.latitude, dto.longitude, dto.nationality, dto.passportNumber, dto.passportExpiry, dto.phoneNumber, dto.dateOfBirth || null, dto.departureDate, dto.returnDate);
            // Save the reservation
            yield this.repo.create(reservation);
            // Send notification to customer
            const customer = yield this.customerService.findById(dto.customerId);
            if (customer === null || customer === void 0 ? void 0 : customer.authUserId) {
                yield this.notificationService.sendReservationNotification(customer.authUserId, 'Reservation Created - Payment Pending', `Your reservation ${reservation.reservationNumber} has been created. Please complete the payment to confirm.`, { reservationId: reservation.id });
            }
            return reservation;
        });
    }
    /**
     * Marks seats as booked for main, transit, and return flights
     */
    markSeatsAsBooked(flightId, mainFlightSeats, transitFlightSeats, returnFlightSeats) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mark main flight seats as booked
            if (mainFlightSeats.length > 0) {
                // await this.flightService.updateSeatsStatus(flightId, mainFlightSeats, true);
            }
            // Mark transit flight seats as booked
            if (transitFlightSeats.length > 0) {
                // await this.flightService.updateTransitSeatsStatus(flightId, transitFlightSeats, true);
            }
            // Mark return flight seats as booked
            if (returnFlightSeats.length > 0) {
                // await this.flightService.updateReturnSeatsStatus(flightId, returnFlightSeats, true);
            }
        });
    }
    create(dto, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract seat arrays
            const seatNumbers = dto.seat
                ? (Array.isArray(dto.seat) ? dto.seat : [dto.seat])
                : [];
            const id = (0, uuid_1.v4)();
            const reservation = new Reservation_1.Reservation(id, `RES-${Date.now()}`, 'pending', // status
            'pending', // paymentStatus
            dto.clientId, dto.customerId, null, // roomId is no longer supported
            null, // flightId is no longer supported
            null, // tripId is no longer supported
            dto.fromDate || null, dto.toDate || null, dto.adult || null, dto.children || null, dto.infant || 0, dto.rooms || 1, dto.price || 0, seatNumbers, [], // mainFlightSeats
            [], // transitFlightSeats
            [], // returnFlightSeats
            dto.baggage || null, dto.meals && dto.meals.length > 0 ? dto.meals[0] : null, dto.extraBaggage && dto.extraBaggage.length > 0 ? dto.extraBaggage[0] : null, dto.airportTransfer && dto.airportTransfer.length > 0 ? dto.airportTransfer[0] : null, dto.unlimitedInternet && dto.unlimitedInternet.length > 0 ? dto.unlimitedInternet[0] : null, dto.extras, dto.name, dto.email, dto.gender, dto.latitude, dto.longitude, dto.nationality, dto.passportNumber, dto.passportExpiry, dto.phoneNumber, dto.dateOfBirth || null, dto.departureDate, dto.returnDate);
            // Calculate the total amount for the reservation
            const amount = yield this.calculateReservationAmount(dto);
            // Save the reservation first
            yield this.repo.create(reservation);
            try {
                // Process payment using the reservation payment service
                const paymentDetails = {
                    amount,
                    currency: 'AED',
                    customerEmail: dto.email || '',
                    description: `Reservation #${reservation.reservationNumber}`,
                    metadata: {
                        reservationId: reservation.id,
                        reservationNumber: reservation.reservationNumber,
                        serviceType: dto.serviceType,
                        serviceId: dto.serviceId
                    },
                    successUrl: `${process.env.FRONTEND_URL}/reservations/${reservation.id}/success`,
                    cancelUrl: `${process.env.FRONTEND_URL}/reservations/${reservation.id}/cancel`
                };
                const paymentResult = yield this.reservationPaymentService.processPayment(reservation.id, paymentMethod, paymentDetails);
                // Update reservation status based on payment result
                if (paymentResult.success) {
                    // If payment was processed immediately (e.g., card payment)
                    reservation.confirmPayment(paymentResult.paymentId || '', paymentMethod, paymentResult.amount || 0, paymentResult.currency || 'USD');
                    // No flight seat booking logic needed anymore
                }
                else if (paymentResult.redirectUrl) {
                    // If payment requires redirection (e.g., 3D Secure, bank redirect)
                    reservation.status = 'pending';
                    reservation.paymentStatus = 'pending';
                }
                else {
                    // Handle other cases
                    reservation.markAsFailed();
                }
                // Update the reservation with the new status
                yield this.repo.update(reservation);
                // Send notification to customer
                const customer = yield this.customerService.findById(dto.customerId);
                if (customer === null || customer === void 0 ? void 0 : customer.authUserId) {
                    yield this.notificationService.sendReservationNotification(customer.authUserId, 'Reservation Created - Payment Pending', `Your reservation ${reservation.reservationNumber} has been created. Please complete the payment to confirm.`, { reservationId: reservation.id });
                }
                return {
                    reservation,
                    paymentUrl: paymentResult.redirectUrl || `${process.env.FRONTEND_URL}/reservations/${reservation.id}`
                };
            }
            catch (error) {
                // Log the error but keep the status as pending
                console.error('Error processing payment for reservation:', error);
                // Update the reservation with pending status
                reservation.status = 'pending';
                reservation.paymentStatus = 'pending';
                yield this.repo.update(reservation);
                // Return the reservation with pending status
                return {
                    reservation,
                    paymentUrl: `${process.env.FRONTEND_URL}/reservations/${reservation.id}`
                };
            }
        });
    }
    listReservations(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const [data, total] = yield this.repo.findAndCount(filters);
            const enriched = yield Promise.all(data.map((r) => __awaiter(this, void 0, void 0, function* () {
                const [client, customer, payments] = yield Promise.all([
                    this.clientService.getClient(r.clientId),
                    this.customerService.findById(r.customerId),
                    this.paymentRepo.findByReservationId(r.id)
                ]);
                const payment = payments.length > 0 ? payments[0] : null;
                const _a = r, { seats } = _a, reservationWithoutSeats = __rest(_a, ["seats"]); // No longer fetching room, flight, trip data directly
                return Object.assign(Object.assign({}, reservationWithoutSeats), { client,
                    customer, room: null, flight: null, trip: null });
            })));
            return {
                data: enriched,
                total,
                page: (_a = filters.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = filters.limit) !== null && _b !== void 0 ? _b : 20,
            };
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.repo.findById(id);
            if (!r)
                throw new Error("Reservation not found");
            // Get the latest payment for this reservation
            const payments = yield this.paymentRepo.findByReservationId(id);
            // Create a new Reservation instance
            const reservation = new Reservation_1.Reservation(r.id, r.reservationNumber, r.status, r.paymentStatus, r.clientId, r.customerId, null, // roomId is no longer supported
            null, // flightId is no longer supported
            null, // tripId is no longer supported
            r.fromDate, r.toDate, r.adult, r.children, r.infant, r.rooms, r.price, r.seats, r.mainFlightSeats, r.transitFlightSeats, r.returnFlightSeats, r.baggage, r.meals, r.extraBaggage, r.airportTransfer, r.unlimitedInternet, r.extras, r.name, r.email, r.gender, r.latitude, r.longitude, r.nationality, r.passportNumber, r.passportExpiry, r.phoneNumber, r.dateOfBirth, r.departureDate, r.returnDate);
            // Set the payment if it exists
            if (payments.length > 0) {
                reservation.payment = payments[0];
            }
            return reservation;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.repo.findById(id);
            if (!existing) {
                throw new Error('Reservation not found');
            }
            // Ensure the status is a valid ReservationStatus
            const status = dto.status || existing.status;
            const updated = new Reservation_1.Reservation(existing.id, dto.reservationNumber || existing.reservationNumber, status, 'pending', // paymentStatus - will be updated based on payment
            dto.clientId || existing.clientId, dto.customerId || existing.customerId, null, // roomId is no longer supported
            null, // flightId is no longer supported
            null, // tripId is no longer supported
            dto.fromDate || existing.fromDate, dto.toDate || existing.toDate, dto.adult !== undefined ? dto.adult : existing.adult, dto.children !== undefined ? dto.children : existing.children, dto.infant !== undefined ? dto.infant : existing.infant, dto.rooms !== undefined ? dto.rooms : existing.rooms, dto.price !== undefined ? dto.price : existing.price, dto.seat !== undefined
                ? Array.isArray(dto.seat)
                    ? dto.seat
                    : [dto.seat].filter(Boolean)
                : existing.seats, dto.mainFlightSeats !== undefined
                ? Array.isArray(dto.mainFlightSeats)
                    ? dto.mainFlightSeats
                    : [dto.mainFlightSeats].filter(Boolean)
                : existing.mainFlightSeats, dto.transitFlightSeats !== undefined
                ? Array.isArray(dto.transitFlightSeats)
                    ? dto.transitFlightSeats
                    : [dto.transitFlightSeats].filter(Boolean)
                : existing.transitFlightSeats, dto.returnFlightSeats !== undefined
                ? Array.isArray(dto.returnFlightSeats)
                    ? dto.returnFlightSeats
                    : [dto.returnFlightSeats].filter(Boolean)
                : existing.returnFlightSeats, dto.baggage !== undefined ? dto.baggage : existing.baggage, dto.meals !== undefined ? (Array.isArray(dto.meals) && dto.meals.length > 0 ? dto.meals[0] : null) : existing.meals, dto.extraBaggage !== undefined ? (Array.isArray(dto.extraBaggage) && dto.extraBaggage.length > 0 ? dto.extraBaggage[0] : null) : existing.extraBaggage, dto.airportTransfer !== undefined ? (Array.isArray(dto.airportTransfer) && dto.airportTransfer.length > 0 ? dto.airportTransfer[0] : null) : existing.airportTransfer, dto.unlimitedInternet !== undefined ? (Array.isArray(dto.unlimitedInternet) && dto.unlimitedInternet.length > 0 ? dto.unlimitedInternet[0] : null) : existing.unlimitedInternet, dto.extras ? (typeof dto.extras === 'string' ? JSON.parse(dto.extras) : dto.extras) : existing.extras, 
            // Update customer details if provided
            dto.name !== undefined ? dto.name : existing.name, dto.email !== undefined ? dto.email : existing.email, dto.gender !== undefined ? dto.gender : existing.gender, dto.latitude !== undefined ? dto.latitude : existing.latitude, dto.longitude !== undefined ? dto.longitude : existing.longitude, dto.nationality !== undefined ? dto.nationality : existing.nationality, dto.passportNumber !== undefined ? dto.passportNumber : existing.passportNumber, dto.passportExpiry !== undefined ? dto.passportExpiry : existing.passportExpiry, dto.phoneNumber !== undefined ? dto.phoneNumber : existing.phoneNumber, dto.dateOfBirth !== undefined ? dto.dateOfBirth : existing.dateOfBirth, dto.departureDate !== undefined ? dto.departureDate : existing.departureDate, dto.returnDate !== undefined ? dto.returnDate : existing.returnDate);
            yield this.repo.update(updated);
            return updated;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    confirmPayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the payment record
            const payment = yield this.paymentRepo.findById(paymentId);
            if (!payment || !payment.reservationId) {
                throw new Error('Payment not found or not linked to a reservation');
            }
            // Update payment status
            payment.transactionStatus = 'paid';
            yield this.paymentRepo.update(payment);
            // Update reservation status to confirmed
            const reservation = yield this.repo.findById(payment.reservationId);
            if (!reservation) {
                throw new Error('Reservation not found');
            }
            reservation.status = 'confirmed';
            yield this.repo.update(reservation);
            // Send confirmation notification
            const customer = yield this.customerService.findById(reservation.customerId);
            yield this.notificationService.sendReservationNotification(customer.authUserId, "Reservation Confirmed", `Your reservation ${reservation.reservationNumber} has been confirmed. Thank you for your payment!`, { reservationId: reservation.id, status: reservation.status });
            return reservation;
        });
    }
    calculateReservationAmount(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            let baseAmount = 0;
            try {
                // Validate required fields
                if (!dto.serviceType || !dto.serviceId) {
                    throw new Error('Service type and service ID are required');
                }
                // Calculate base amount based on service type
                if (dto.serviceType === 'room' && dto.serviceId) {
                    // Room service is not supported
                    throw new Error('Room service is not supported');
                }
                else if (dto.serviceType === 'flight' && dto.serviceId) {
                    // Flight service is not supported
                    throw new Error('Flight service is not supported');
                }
                else if (dto.serviceType === 'trip' && dto.serviceId) {
                    // Trip service is not supported
                    throw new Error('Trip service is not supported');
                }
                // No other service types are supported, so baseAmount remains 0 unless other logic is added.
                // Add any additional services
                if (dto.extraBaggage && Array.isArray(dto.extraBaggage)) {
                    baseAmount += dto.extraBaggage.reduce((sum, item) => sum + ((item === null || item === void 0 ? void 0 : item.totalPrice) || 0), 0);
                }
                if (dto.airportTransfer && Array.isArray(dto.airportTransfer)) {
                    baseAmount += dto.airportTransfer.reduce((sum, item) => sum + ((item === null || item === void 0 ? void 0 : item.totalPrice) || 0), 0);
                }
                if (dto.unlimitedInternet && Array.isArray(dto.unlimitedInternet)) {
                    baseAmount += dto.unlimitedInternet.reduce((sum, item) => sum + ((item === null || item === void 0 ? void 0 : item.totalPrice) || 0), 0);
                }
                // Ensure we don't return negative amounts
                return Math.max(0, baseAmount);
            }
            catch (error) {
                console.error('Error calculating reservation amount:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                throw new Error(`Failed to calculate reservation amount: ${errorMessage}`);
            }
        });
    }
    cancel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the existing reservation first to preserve its data
            const existing = yield this.get(id);
            // Create a clean update object with only the necessary fields
            const updateData = {
                // Use the seats array directly
                seats: existing.seats || [],
                mainFlightSeats: [], // mainFlightSeats is no longer supported
                transitFlightSeats: [], // transitFlightSeats is no longer supported
                returnFlightSeats: [], // returnFlightSeats is no longer supported
                // Set status to cancelled
                status: "cancelled"
            };
            // Add optional fields if they exist in the existing reservation
            const optionalFields = [
                'clientId', 'customerId', 'serviceType', 'fromDate', 'toDate',
                'adult', 'children', 'infant', 'rooms', 'price', 'baggage',
                'meals', 'extraBaggage', 'airportTransfer', 'unlimitedInternet',
                'extras', 'name', 'email', 'gender', 'phoneNumber', 'nationality',
                'passportNumber', 'dateOfBirth', 'specialRequests', 'notes',
                'checkInTime', 'checkOutTime', // removed flightNumber, airline, departureAirport, arrivalAirport, departureTime, arrivalTime, tripType, returnDate, tripDuration, destination, accommodation, activities, inclusions, exclusions, cancellationPolicy, paymentTerms, termsAndConditions
            ];
            // Only include fields that exist in the existing reservation
            optionalFields.forEach(field => {
                if (field in existing) {
                    updateData[field] = existing[field] || undefined;
                }
            });
            // Update the reservation
            const cancelled = yield this.update(id, updateData);
            // Update any pending payments
            const payments = yield this.paymentRepo.findByReservationId(id);
            for (const payment of payments) {
                if (payment.transactionStatus === 'under_review') {
                    payment.transactionStatus = 'cancelled';
                    yield this.paymentRepo.update(payment);
                }
            }
            const customer = yield this.customerService.findById(cancelled.customerId);
            yield this.notificationService.sendReservationNotification(customer.authUserId, "Reservation Cancelled", `Your reservation ${cancelled.reservationNumber} has been cancelled.`, { reservationId: cancelled.id, status: cancelled.status });
            return cancelled;
        });
    }
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ReservationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.PaymentRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.PaymentService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ReservationPaymentService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ClientService)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.CustomerService)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.NotificationService)),
    __metadata("design:paramtypes", [Object, Object, PaymentService_1.PaymentService,
        ReservationPaymentService_1.ReservationPaymentService,
        ClientService_1.ClientService,
        CustomerService_1.CustomerService,
        NotificationService_1.NotificationService])
], ReservationService);
