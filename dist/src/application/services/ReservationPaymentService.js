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
exports.ReservationPaymentService = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const Payment_1 = require("../../core/entities/Payment");
const mimoService_1 = require("./mimoService");
const CustomerService_1 = require("./CustomerService");
const NotificationService_1 = require("./NotificationService");
const types_1 = require("../../shared/di/types");
let ReservationPaymentService = class ReservationPaymentService {
    constructor(reservationRepo, paymentRepo, mimoService, customerService, notificationService) {
        this.reservationRepo = reservationRepo;
        this.paymentRepo = paymentRepo;
        this.mimoService = mimoService;
        this.customerService = customerService;
        this.notificationService = notificationService;
    }
    processPayment(reservationId, gateway, paymentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservation = yield this.reservationRepo.findById(reservationId);
                if (!reservation) {
                    throw new Error('Reservation not found');
                }
                if (reservation.status !== 'pending') {
                    throw new Error(`Cannot process payment for reservation with status: ${reservation.status}`);
                }
                let result;
                // Route to the appropriate payment gateway
                switch (gateway) {
                    case 'stripe':
                        result = yield this.processStripePayment(reservation, paymentDetails);
                        break;
                    case 'tamara':
                        result = yield this.processTamaraPayment(reservation, paymentDetails);
                        break;
                    case 'mimo':
                        result = yield this.processMimoPayment(reservation, paymentDetails);
                        break;
                    default:
                        throw new Error(`Unsupported payment gateway: ${gateway}`);
                }
                // Update reservation status based on payment result
                if (result.success && result.status === 'paid') {
                    reservation.confirmPayment(result.paymentId, gateway, paymentDetails.amount, paymentDetails.currency);
                }
                else if (result.status === 'failed') {
                    reservation.markAsFailed();
                }
                // Save the updated reservation
                yield this.reservationRepo.update(reservation);
                // Create payment record
                const payment = new Payment_1.Payment(result.paymentId, `PAY-${Date.now()}`, reservationId, reservation.customerId, reservation.clientId, 'reservation', result.status === 'paid' ? 'paid' : 'under_review', paymentDetails.amount, new Date());
                // Store additional payment details in metadata if needed
                const paymentMetadata = Object.assign(Object.assign({}, paymentDetails.metadata), { gatewayResponse: result, gateway: gateway, currency: paymentDetails.currency || 'USD' });
                // If you need to store metadata, you might need to extend the Payment class or use a separate table
                yield this.paymentRepo.create(payment);
                return result;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                console.error('Payment processing failed:', errorMessage);
                return {
                    success: false,
                    paymentId: `err_${Date.now()}`,
                    status: 'failed',
                    gateway,
                    error: errorMessage
                };
            }
        });
    }
    processStripePayment(reservation, paymentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // In a real implementation, this would call the Stripe API
                // For now, we'll simulate a successful payment
                const paymentId = `stripe_${(0, uuid_1.v4)()}`;
                return {
                    success: true,
                    paymentId,
                    status: 'paid',
                    gateway: 'stripe',
                    redirectUrl: undefined // No redirect needed for immediate payments
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Stripe payment failed';
                console.error('Stripe payment failed:', errorMessage);
                return {
                    success: false,
                    paymentId: `stripe_err_${(0, uuid_1.v4)()}`,
                    status: 'failed',
                    gateway: 'stripe',
                    error: errorMessage
                };
            }
        });
    }
    processTamaraPayment(reservation, paymentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // In a real implementation, this would call the Tamara API
                // For now, we'll simulate a successful payment initiation
                const paymentId = `tamara_${(0, uuid_1.v4)()}`;
                // Tamara typically requires redirection to their payment page
                return {
                    success: true,
                    paymentId,
                    status: 'pending', // Tamara payments are typically pending until confirmed
                    gateway: 'tamara',
                    redirectUrl: `https://checkout.tamara.co/checkout/${paymentId}`
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Tamara payment failed';
                console.error('Tamara payment failed:', errorMessage);
                return {
                    success: false,
                    paymentId: `tamara_err_${(0, uuid_1.v4)()}`,
                    status: 'failed',
                    gateway: 'tamara',
                    error: errorMessage
                };
            }
        });
    }
    processMimoPayment(reservation, paymentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Create mimo payment link data
                const mimoPaymentData = {
                    title: `Reservation Payment - ${reservation.reservationNumber}`,
                    amount: paymentDetails.amount,
                    currency: paymentDetails.currency || 'AED',
                    return_url: paymentDetails.successUrl || `${process.env.FRONTEND_URL}/reservations/${reservation.id}/success`,
                    capture_method: 'MANUAL',
                    hold_and_charge_later: false
                };
                // Create payment link using MimoService
                const mimoResponse = yield this.mimoService.createPaymentLink(mimoPaymentData);
                // Extract payment URL from response
                const paymentUrl = ((_a = mimoResponse === null || mimoResponse === void 0 ? void 0 : mimoResponse.data) === null || _a === void 0 ? void 0 : _a.url) || (mimoResponse === null || mimoResponse === void 0 ? void 0 : mimoResponse.url);
                if (!paymentUrl) {
                    throw new Error('No payment URL returned from Mimo');
                }
                const paymentId = ((_b = mimoResponse === null || mimoResponse === void 0 ? void 0 : mimoResponse.data) === null || _b === void 0 ? void 0 : _b.id) || `mimo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                return {
                    success: true,
                    paymentId,
                    status: 'pending',
                    gateway: 'mimo',
                    redirectUrl: paymentUrl,
                    amount: paymentDetails.amount,
                    currency: paymentDetails.currency || 'USD'
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Mimo payment failed';
                console.error('Mimo payment failed:', errorMessage);
                return {
                    success: false,
                    paymentId: `mimo_err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    status: 'failed',
                    gateway: 'mimo',
                    error: errorMessage
                };
            }
        });
    }
    updateAllPaymentsForReservation(reservationId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all payments for this reservation
                const payments = yield this.paymentRepo.findByReservationId(reservationId);
                // Update the status of all payments
                for (const payment of payments) {
                    payment.transactionStatus = status;
                    yield this.paymentRepo.update(payment);
                }
                console.log(`✅ Updated ${payments.length} payments for reservation ${reservationId} to status: ${status}`);
            }
            catch (error) {
                console.error(`❌ Error updating payments for reservation ${reservationId}:`, error);
                throw error;
            }
        });
    }
    handlePaymentWebhook(gateway, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Route to the appropriate webhook handler
                switch (gateway) {
                    case 'stripe':
                        yield this.handleStripeWebhook(payload);
                        break;
                    case 'tamara':
                        yield this.handleTamaraWebhook(payload);
                        break;
                    case 'mimo':
                        yield this.handleMimoWebhook(payload);
                        break;
                    default:
                        console.warn(`Unsupported payment gateway for webhook: ${gateway}`);
                }
            }
            catch (error) {
                console.error(`Error processing ${gateway} webhook:`, error);
                throw error;
            }
        });
    }
    handleStripeWebhook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                console.log('🔄 Processing Stripe webhook:', JSON.stringify(payload, null, 2));
                // Extract Stripe event data
                const eventType = payload.type;
                const eventData = (_a = payload.data) === null || _a === void 0 ? void 0 : _a.object;
                if (!eventData) {
                    console.warn('⚠️ No event data in Stripe webhook');
                    return;
                }
                // Extract payment/session information
                let paymentId = null;
                let reservationId = null;
                let paymentStatus = null;
                // Handle different Stripe event types
                switch (eventType) {
                    case 'checkout.session.completed':
                        const session = eventData;
                        paymentId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.paymentId;
                        reservationId = (_c = session.metadata) === null || _c === void 0 ? void 0 : _c.reservationId;
                        paymentStatus = 'completed';
                        break;
                    case 'payment_intent.succeeded':
                        const paymentIntent = eventData;
                        paymentStatus = 'succeeded';
                        // For payment_intent events, we'll find the payment by processNumber
                        break;
                    case 'payment_intent.payment_failed':
                        const failedPayment = eventData;
                        paymentStatus = 'failed';
                        break;
                    case 'charge.updated':
                        const charge = eventData;
                        paymentStatus = 'succeeded';
                        // For charge events, we'll find the payment by payment_intent ID as processNumber
                        break;
                    default:
                        console.log(`ℹ️ Unhandled Stripe event type: ${eventType}`);
                        return;
                }
                // Find the reservation and payment based on available data
                let reservation = null;
                let payment = null;
                if (reservationId && paymentId) {
                    // Case 1: We have both reservationId and paymentId (from checkout.session.completed)
                    reservation = yield this.reservationRepo.findById(reservationId);
                    if (!reservation) {
                        console.warn(`⚠️ Reservation not found for ID: ${reservationId}`);
                        return;
                    }
                    // Find the payment record
                    const payments = yield this.paymentRepo.findByReservationId(reservationId);
                    payment = payments.find(p => p.id === paymentId);
                    if (!payment) {
                        console.warn(`⚠️ Payment not found for reservation ${reservationId} and payment ${paymentId}`);
                        return;
                    }
                }
                else {
                    // Case 2: We don't have reservationId or paymentId (from payment_intent or charge events)
                    // We need to find payment by processNumber (which should match payment_intent.id or charge.id)
                    let processNumber = null;
                    if (eventType === 'payment_intent.succeeded' || eventType === 'payment_intent.payment_failed') {
                        processNumber = eventData.id; // payment_intent.id
                    }
                    else if ((eventType === 'charge.succeeded' || eventType === 'charge.updated') && eventData.payment_intent) {
                        processNumber = eventData.payment_intent; // payment_intent.id for charge events
                    }
                    if (processNumber) {
                        payment = yield this.paymentRepo.findByProcessNumber(processNumber);
                        if (!payment) {
                            console.warn(`⚠️ Payment not found for processNumber: ${processNumber}`);
                            return;
                        }
                        // Now get the reservation from the payment
                        reservation = yield this.reservationRepo.findById(payment.reservationId);
                        if (!reservation) {
                            console.warn(`⚠️ Reservation not found for payment: ${payment.id}`);
                            return;
                        }
                    }
                    else {
                        console.warn('⚠️ No processNumber available for payment lookup');
                        return;
                    }
                }
                // Process based on payment status
                switch (paymentStatus === null || paymentStatus === void 0 ? void 0 : paymentStatus.toLowerCase()) {
                    case 'completed':
                    case 'succeeded':
                        // Payment successful - confirm the reservation
                        reservation.confirmPayment(payment.id, 'stripe', payment.amount, ((_d = eventData.currency) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || 'USD');
                        // Update all payments for this reservation to 'paid'
                        yield this.updateAllPaymentsForReservation(reservation.id, 'paid');
                        console.log(`✅ Reservation ${reservation.id} confirmed via Stripe webhook`);
                        // Send confirmation notification
                        const customer = yield this.customerService.findById(reservation.customerId);
                        if (customer === null || customer === void 0 ? void 0 : customer.authUserId) {
                            yield this.notificationService.sendReservationNotification(customer.authUserId, 'Payment Confirmed', `Your payment for reservation ${reservation.reservationNumber} has been confirmed via Stripe.`, { reservationId: reservation.id, status: 'confirmed', gateway: 'stripe' });
                        }
                        break;
                    case 'failed':
                        // Payment failed - mark reservation as failed
                        reservation.markAsFailed();
                        // Update all payments for this reservation to 'cancelled'
                        yield this.updateAllPaymentsForReservation(reservation.id, 'cancelled');
                        console.log(`❌ Payment failed for reservation ${reservation.id} via Stripe webhook`);
                        // Send failure notification
                        const customerFailed = yield this.customerService.findById(reservation.customerId);
                        if (customerFailed === null || customerFailed === void 0 ? void 0 : customerFailed.authUserId) {
                            yield this.notificationService.sendReservationNotification(customerFailed.authUserId, 'Payment Failed', `Your payment for reservation ${reservation.reservationNumber} has failed via Stripe. Please try again.`, { reservationId: reservation.id, status: 'failed', gateway: 'stripe' });
                        }
                        break;
                    case 'pending':
                    case 'processing':
                        // Payment still processing - update status but don't change reservation status
                        payment.transactionStatus = 'under_review';
                        yield this.paymentRepo.update(payment);
                        console.log(`⏳ Payment ${payment.id} is still processing for reservation ${reservation.id}`);
                        break;
                    default:
                        console.warn(`⚠️ Unknown payment status from Stripe webhook: ${paymentStatus}`);
                        break;
                }
                // Update reservation in database
                yield this.reservationRepo.update(reservation);
            }
            catch (error) {
                console.error('❌ Error processing Stripe webhook:', error);
                throw error;
            }
        });
    }
    handleTamaraWebhook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 Processing Tamara webhook:', JSON.stringify(payload, null, 2));
                // Extract Tamara event data
                const eventType = payload.event_type;
                const eventData = payload;
                if (!eventData) {
                    console.warn('⚠️ No event data in Tamara webhook');
                    return;
                }
                // Extract order/payment information
                let orderId = null;
                let reservationId = null;
                let orderStatus = null;
                // Handle different Tamara event types
                switch (eventType) {
                    case 'order.authorised':
                        orderId = eventData.order_id || eventData.order_reference_id;
                        orderStatus = 'authorised';
                        reservationId = eventData.order_reference_id; // Assuming order_reference_id contains reservation ID
                        break;
                    case 'order.captured':
                        orderId = eventData.order_id || eventData.order_reference_id;
                        orderStatus = 'captured';
                        reservationId = eventData.order_reference_id;
                        break;
                    case 'order.cancelled':
                        orderId = eventData.order_id || eventData.order_reference_id;
                        orderStatus = 'cancelled';
                        reservationId = eventData.order_reference_id;
                        break;
                    case 'order.declined':
                        orderId = eventData.order_id || eventData.order_reference_id;
                        orderStatus = 'declined';
                        reservationId = eventData.order_reference_id;
                        break;
                    case 'order.expired':
                        orderId = eventData.order_id || eventData.order_reference_id;
                        orderStatus = 'expired';
                        reservationId = eventData.order_reference_id;
                        break;
                    default:
                        console.log(`ℹ️ Unhandled Tamara event type: ${eventType}`);
                        return;
                }
                if (!orderId || !reservationId) {
                    console.warn('⚠️ Missing orderId or reservationId in Tamara webhook');
                    return;
                }
                // Find the reservation
                const reservation = yield this.reservationRepo.findById(reservationId);
                if (!reservation) {
                    console.warn(`⚠️ Reservation not found for ID: ${reservationId}`);
                    return;
                }
                // Find the payment record
                const payments = yield this.paymentRepo.findByReservationId(reservationId);
                const payment = payments.find(p => p.processNumber.includes(orderId) || p.id === orderId);
                if (!payment) {
                    console.warn(`⚠️ Payment not found for reservation ${reservationId} and order ${orderId}`);
                    return;
                }
                // Process based on order status
                switch (orderStatus === null || orderStatus === void 0 ? void 0 : orderStatus.toLowerCase()) {
                    case 'authorised':
                    case 'captured':
                        // Payment successful - confirm the reservation
                        reservation.confirmPayment(payment.id, 'tamara', payment.amount, eventData.currency || 'AED');
                        // Update all payments for this reservation to 'paid'
                        yield this.updateAllPaymentsForReservation(reservationId, 'paid');
                        console.log(`✅ Reservation ${reservationId} confirmed via Tamara webhook`);
                        // Send confirmation notification
                        const customer = yield this.customerService.findById(reservation.customerId);
                        if (customer === null || customer === void 0 ? void 0 : customer.authUserId) {
                            yield this.notificationService.sendReservationNotification(customer.authUserId, 'Payment Confirmed', `Your payment for reservation ${reservation.reservationNumber} has been confirmed via Tamara.`, { reservationId: reservation.id, status: 'confirmed', gateway: 'tamara' });
                        }
                        break;
                    case 'cancelled':
                    case 'declined':
                    case 'expired':
                        // Payment failed - mark reservation as failed
                        reservation.markAsFailed();
                        // Update all payments for this reservation to 'cancelled'
                        yield this.updateAllPaymentsForReservation(reservationId, 'cancelled');
                        console.log(`❌ Payment ${orderStatus} for reservation ${reservationId} via Tamara webhook`);
                        // Send failure notification
                        const customerFailed = yield this.customerService.findById(reservation.customerId);
                        if (customerFailed === null || customerFailed === void 0 ? void 0 : customerFailed.authUserId) {
                            yield this.notificationService.sendReservationNotification(customerFailed.authUserId, 'Payment Failed', `Your payment for reservation ${reservation.reservationNumber} has ${orderStatus} via Tamara. Please try again.`, { reservationId: reservation.id, status: 'failed', gateway: 'tamara' });
                        }
                        break;
                    case 'pending':
                    case 'processing':
                        // Payment still processing - update status but don't change reservation status
                        payment.transactionStatus = 'under_review';
                        yield this.paymentRepo.update(payment);
                        console.log(`⏳ Payment ${orderId} is still processing for reservation ${reservationId}`);
                        break;
                    default:
                        console.warn(`⚠️ Unknown order status from Tamara webhook: ${orderStatus}`);
                        break;
                }
                // Update reservation in database
                yield this.reservationRepo.update(reservation);
            }
            catch (error) {
                console.error('❌ Error processing Tamara webhook:', error);
                throw error;
            }
        });
    }
    handleMimoWebhook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                console.log('🔄 Processing Mimo webhook:', JSON.stringify(payload, null, 2));
                // Extract mimo payment data from webhook payload
                const paymentId = ((_a = payload === null || payload === void 0 ? void 0 : payload.data) === null || _a === void 0 ? void 0 : _a.id) || (payload === null || payload === void 0 ? void 0 : payload.id);
                const paymentStatus = ((_b = payload === null || payload === void 0 ? void 0 : payload.data) === null || _b === void 0 ? void 0 : _b.status) || (payload === null || payload === void 0 ? void 0 : payload.status);
                const reservationId = ((_d = (_c = payload === null || payload === void 0 ? void 0 : payload.data) === null || _c === void 0 ? void 0 : _c.metadata) === null || _d === void 0 ? void 0 : _d.reservationId) || ((_e = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _e === void 0 ? void 0 : _e.reservationId);
                if (!paymentId || !reservationId) {
                    console.warn('⚠️ Missing paymentId or reservationId in Mimo webhook');
                    return;
                }
                // Find the reservation
                const reservation = yield this.reservationRepo.findById(reservationId);
                if (!reservation) {
                    console.warn(`⚠️ Reservation not found for ID: ${reservationId}`);
                    return;
                }
                // Find the payment record
                const payments = yield this.paymentRepo.findByReservationId(reservationId);
                const payment = payments.find(p => p.id === paymentId);
                if (!payment) {
                    console.warn(`⚠️ Payment not found for reservation ${reservationId} and payment ${paymentId}`);
                    return;
                }
                // Process based on payment status
                switch (paymentStatus === null || paymentStatus === void 0 ? void 0 : paymentStatus.toLowerCase()) {
                    case 'paid':
                    case 'completed':
                    case 'success':
                        // Payment successful - confirm the reservation
                        reservation.confirmPayment(paymentId, 'mimo', payment.amount, 'AED' // Default currency for mimo
                        );
                        // Update all payments for this reservation to 'paid'
                        yield this.updateAllPaymentsForReservation(reservationId, 'paid');
                        console.log(`✅ Reservation ${reservationId} confirmed via Mimo webhook`);
                        // Send confirmation notification
                        const customer = yield this.customerService.findById(reservation.customerId);
                        if (customer === null || customer === void 0 ? void 0 : customer.authUserId) {
                            yield this.notificationService.sendReservationNotification(customer.authUserId, 'Payment Confirmed', `Your payment for reservation ${reservation.reservationNumber} has been confirmed.`, { reservationId: reservation.id, status: 'confirmed' });
                        }
                        break;
                    case 'failed':
                    case 'cancelled':
                    case 'rejected':
                        // Payment failed - mark reservation as failed
                        reservation.markAsFailed();
                        // Update all payments for this reservation to 'cancelled'
                        yield this.updateAllPaymentsForReservation(reservationId, 'cancelled');
                        console.log(`❌ Payment failed for reservation ${reservationId} via Mimo webhook`);
                        // Send failure notification
                        const customerFailed = yield this.customerService.findById(reservation.customerId);
                        if (customerFailed === null || customerFailed === void 0 ? void 0 : customerFailed.authUserId) {
                            yield this.notificationService.sendReservationNotification(customerFailed.authUserId, 'Payment Failed', `Your payment for reservation ${reservation.reservationNumber} has failed. Please try again.`, { reservationId: reservation.id, status: 'failed' });
                        }
                        break;
                    case 'pending':
                    case 'processing':
                        // Payment still processing - update status but don't change reservation status
                        payment.transactionStatus = 'under_review';
                        yield this.paymentRepo.update(payment);
                        console.log(`⏳ Payment ${paymentId} is still processing for reservation ${reservationId}`);
                        break;
                    default:
                        console.warn(`⚠️ Unknown payment status from Mimo webhook: ${paymentStatus}`);
                        break;
                }
                // Update reservation in database
                yield this.reservationRepo.update(reservation);
            }
            catch (error) {
                console.error('❌ Error processing Mimo webhook:', error);
                throw error;
            }
        });
    }
    cancelReservation(reservationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield this.reservationRepo.findById(reservationId);
            if (!reservation) {
                throw new Error('Reservation not found');
            }
            if (reservation.status === 'cancelled') {
                return reservation; // Already canceled
            }
            // Process refund if payment was made
            if (reservation.paymentStatus === 'paid' && reservation.paymentId && reservation.paymentGateway) {
                const refundResult = yield this.processRefund(reservation);
                if (refundResult.success) {
                    // Update payment status to refunded
                    const payment = yield this.paymentRepo.findById(reservation.paymentId);
                    if (payment) {
                        payment.transactionStatus = 'refunded';
                        yield this.paymentRepo.update(payment);
                    }
                }
                else {
                    console.error('Refund failed:', refundResult.error);
                    throw new Error(`Refund failed: ${refundResult.error}`);
                }
            }
            // Update reservation status
            reservation.cancel();
            yield this.reservationRepo.update(reservation);
            return reservation;
        });
    }
    processRefund(reservation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (reservation.paymentGateway) {
                    case 'stripe':
                        return yield this.processStripeRefund(reservation);
                    case 'tamara':
                        return yield this.processTamaraRefund(reservation);
                    case 'mimo':
                        return yield this.processMimoRefund(reservation);
                    default:
                        return { success: false, error: `Unsupported payment gateway: ${reservation.paymentGateway}` };
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                console.error('Refund processing failed:', errorMessage);
                return { success: false, error: errorMessage };
            }
        });
    }
    processStripeRefund(reservation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // In a real implementation, this would call the Stripe API to process refund
                // For now, we'll simulate a successful refund
                console.log(`Processing Stripe refund for payment ${reservation.paymentId}, amount: ${reservation.amount}`);
                // Simulate API call delay
                yield new Promise(resolve => setTimeout(resolve, 1000));
                return { success: true };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Stripe refund failed';
                console.error('Stripe refund failed:', errorMessage);
                return { success: false, error: errorMessage };
            }
        });
    }
    processTamaraRefund(reservation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // In a real implementation, this would call the Tamara API to process refund
                // For now, we'll simulate a successful refund
                console.log(`Processing Tamara refund for payment ${reservation.paymentId}, amount: ${reservation.amount}`);
                // Simulate API call delay
                yield new Promise(resolve => setTimeout(resolve, 1000));
                return { success: true };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Tamara refund failed';
                console.error('Tamara refund failed:', errorMessage);
                return { success: false, error: errorMessage };
            }
        });
    }
    processMimoRefund(reservation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // In a real implementation, this would call the Mimo API to process refund
                // For now, we'll simulate a successful refund
                console.log(`Processing Mimo refund for payment ${reservation.paymentId}, amount: ${reservation.amount}`);
                // Simulate API call delay
                yield new Promise(resolve => setTimeout(resolve, 1000));
                return { success: true };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Mimo refund failed';
                console.error('Mimo refund failed:', errorMessage);
                return { success: false, error: errorMessage };
            }
        });
    }
    handleRefundWebhook(gateway, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`🔄 Processing ${gateway} refund webhook:`, JSON.stringify(payload, null, 2));
                // Route to the appropriate refund webhook handler
                switch (gateway) {
                    case 'stripe':
                        yield this.handleStripeRefundWebhook(payload);
                        break;
                    case 'tamara':
                        yield this.handleTamaraRefundWebhook(payload);
                        break;
                    case 'mimo':
                        yield this.handleMimoRefundWebhook(payload);
                        break;
                    default:
                        console.warn(`Unsupported payment gateway for refund webhook: ${gateway}`);
                }
            }
            catch (error) {
                console.error(`Error processing ${gateway} refund webhook:`, error);
                throw error;
            }
        });
    }
    handleStripeRefundWebhook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                // Extract refund information from Stripe webhook
                const refundId = (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.data) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.id;
                const paymentIntentId = (_d = (_c = payload === null || payload === void 0 ? void 0 : payload.data) === null || _c === void 0 ? void 0 : _c.object) === null || _d === void 0 ? void 0 : _d.payment_intent;
                const refundStatus = (_f = (_e = payload === null || payload === void 0 ? void 0 : payload.data) === null || _e === void 0 ? void 0 : _e.object) === null || _f === void 0 ? void 0 : _f.status;
                if (!refundId || !paymentIntentId) {
                    console.warn('⚠️ Missing refundId or paymentIntentId in Stripe refund webhook');
                    return;
                }
                // Find payment by processNumber (payment_intent ID)
                const payment = yield this.paymentRepo.findByProcessNumber(paymentIntentId);
                if (!payment) {
                    console.warn(`⚠️ Payment not found for paymentIntentId: ${paymentIntentId}`);
                    return;
                }
                // Update payment status based on refund status
                switch (refundStatus === null || refundStatus === void 0 ? void 0 : refundStatus.toLowerCase()) {
                    case 'succeeded':
                        payment.transactionStatus = 'refunded';
                        yield this.paymentRepo.update(payment);
                        console.log(`✅ Refund succeeded for payment ${payment.id} via Stripe webhook`);
                        break;
                    case 'failed':
                    case 'cancelled':
                        payment.transactionStatus = 'failed';
                        yield this.paymentRepo.update(payment);
                        console.log(`❌ Refund failed for payment ${payment.id} via Stripe webhook`);
                        break;
                    default:
                        console.log(`ℹ️ Unhandled refund status from Stripe: ${refundStatus}`);
                        break;
                }
            }
            catch (error) {
                console.error('❌ Error processing Stripe refund webhook:', error);
                throw error;
            }
        });
    }
    handleTamaraRefundWebhook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract refund information from Tamara webhook
                const refundId = (payload === null || payload === void 0 ? void 0 : payload.refund_id) || (payload === null || payload === void 0 ? void 0 : payload.id);
                const orderId = (payload === null || payload === void 0 ? void 0 : payload.order_id) || (payload === null || payload === void 0 ? void 0 : payload.order_reference_id);
                const refundStatus = (payload === null || payload === void 0 ? void 0 : payload.status) || (payload === null || payload === void 0 ? void 0 : payload.refund_status);
                if (!refundId || !orderId) {
                    console.warn('⚠️ Missing refundId or orderId in Tamara refund webhook');
                    return;
                }
                // Find reservation by order reference (assuming order_reference_id contains reservation ID or payment processNumber)
                // First try to find by processNumber
                let payments = yield this.paymentRepo.findByProcessNumber(orderId);
                if (!payments) {
                    console.warn(`⚠️ No payments found for orderId: ${orderId}`);
                    return;
                }
                // Update payment status based on refund status
                switch (refundStatus === null || refundStatus === void 0 ? void 0 : refundStatus.toLowerCase()) {
                    case 'completed':
                    case 'approved':
                        payments.transactionStatus = 'refunded';
                        yield this.paymentRepo.update(payments);
                        console.log(`✅ Refund succeeded for payments related to order ${orderId} via Tamara webhook`);
                        break;
                    case 'failed':
                    case 'declined':
                    case 'cancelled':
                        payments.transactionStatus = 'failed';
                        yield this.paymentRepo.update(payments);
                        console.log(`❌ Refund failed for payments related to order ${orderId} via Tamara webhook`);
                        break;
                    default:
                        console.log(`ℹ️ Unhandled refund status from Tamara: ${refundStatus}`);
                        break;
                }
            }
            catch (error) {
                console.error('❌ Error processing Tamara refund webhook:', error);
                throw error;
            }
        });
    }
    handleMimoRefundWebhook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // Extract refund information from Mimo webhook
                const refundId = ((_a = payload === null || payload === void 0 ? void 0 : payload.data) === null || _a === void 0 ? void 0 : _a.id) || (payload === null || payload === void 0 ? void 0 : payload.id);
                const paymentId = ((_b = payload === null || payload === void 0 ? void 0 : payload.data) === null || _b === void 0 ? void 0 : _b.payment_id) || (payload === null || payload === void 0 ? void 0 : payload.payment_id);
                const refundStatus = ((_c = payload === null || payload === void 0 ? void 0 : payload.data) === null || _c === void 0 ? void 0 : _c.status) || (payload === null || payload === void 0 ? void 0 : payload.status);
                if (!refundId || !paymentId) {
                    console.warn('⚠️ Missing refundId or paymentId in Mimo refund webhook');
                    return;
                }
                // Find payment by ID
                const payment = yield this.paymentRepo.findById(paymentId);
                if (!payment) {
                    console.warn(`⚠️ Payment not found for paymentId: ${paymentId}`);
                    return;
                }
                // Update payment status based on refund status
                switch (refundStatus === null || refundStatus === void 0 ? void 0 : refundStatus.toLowerCase()) {
                    case 'completed':
                    case 'success':
                        payment.transactionStatus = 'refunded';
                        yield this.paymentRepo.update(payment);
                        console.log(`✅ Refund succeeded for payment ${paymentId} via Mimo webhook`);
                        break;
                    case 'failed':
                    case 'cancelled':
                    case 'rejected':
                        payment.transactionStatus = 'failed';
                        yield this.paymentRepo.update(payment);
                        console.log(`❌ Refund failed for payment ${paymentId} via Mimo webhook`);
                        break;
                    default:
                        console.log(`ℹ️ Unhandled refund status from Mimo: ${refundStatus}`);
                        break;
                }
            }
            catch (error) {
                console.error('❌ Error processing Mimo refund webhook:', error);
                throw error;
            }
        });
    }
};
exports.ReservationPaymentService = ReservationPaymentService;
exports.ReservationPaymentService = ReservationPaymentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ReservationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.PaymentRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.MimoService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.CustomerService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.NotificationService)),
    __metadata("design:paramtypes", [Object, Object, mimoService_1.MimoService,
        CustomerService_1.CustomerService,
        NotificationService_1.NotificationService])
], ReservationPaymentService);
exports.default = ReservationPaymentService;
