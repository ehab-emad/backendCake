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
exports.PaymentService = void 0;
const inversify_1 = require("inversify");
const stripe_1 = __importDefault(require("stripe"));
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const Payment_1 = require("../../core/entities/Payment");
const CreatePayment_dto_1 = require("../dto/CreatePayment.dto");
const UpdatePayment_dto_1 = require("../dto/UpdatePayment.dto");
const FilterPayment_dto_1 = require("../dto/FilterPayment.dto");
const StripeSession_dto_1 = require("../dto/StripeSession.dto");
const CreateMamoPayment_dto_1 = require("../dto/CreateMamoPayment.dto");
const types_1 = require("../../shared/di/types");
const mimoService_1 = require("./mimoService");
const CustomerService_1 = require("./CustomerService");
const TamaraService_1 = require("./TamaraService");
const InitiatePayment_dto_1 = require("../dto/InitiatePayment.dto");
let PaymentService = class PaymentService {
    constructor(cfg, repo, customerService, reservationRepo, mimoService, tamaraService) {
        this.cfg = cfg;
        this.repo = repo;
        this.customerService = customerService;
        this.reservationRepo = reservationRepo;
        this.mimoService = mimoService;
        this.tamaraService = tamaraService;
        this.stripe = new stripe_1.default(cfg.STRIPE_SECRET_KEY);
        this.tamaraBaseUrl = cfg.TAMARA_BASE_URL;
        this.mamoBaseUrl = cfg.MAMO_BASE_URL;
    }
    createPayment(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const valid = CreatePayment_dto_1.CreatePaymentSchema.parse(dto);
            const id = (0, uuid_1.v4)();
            const procNum = `PROC-${Date.now()}`;
            const p = new Payment_1.Payment(id, procNum, (_a = valid.reservationId) !== null && _a !== void 0 ? _a : null, (_b = valid.customerId) !== null && _b !== void 0 ? _b : null, (_c = valid.clientId) !== null && _c !== void 0 ? _c : null, valid.category, valid.transactionStatus, valid.amount);
            yield this.repo.create(p);
            return p;
        });
    }
    listPayments(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const f = FilterPayment_dto_1.FilterPaymentSchema.parse(filters);
            const [data, total] = yield this.repo.findAndCount(f);
            return {
                data,
                total,
                page: (_a = f.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = f.limit) !== null && _b !== void 0 ? _b : 20,
            };
        });
    }
    getPayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = yield this.repo.findById(id);
            if (!p)
                throw new Error("Payment not found");
            return p;
        });
    }
    updatePayment(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = UpdatePayment_dto_1.UpdatePaymentSchema.parse(dto);
            const existing = yield this.repo.findById(id);
            if (!existing)
                throw new Error("Payment not found");
            Object.assign(existing, valid);
            yield this.repo.update(existing);
            return existing;
        });
    }
    deletePayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    createStripeSession(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = StripeSession_dto_1.CreateStripeSessionSchema.parse(dto);
            const lineItem = {
                price_data: {
                    currency: valid.currency,
                    product_data: { name: "Travel purchase" },
                    unit_amount: Math.round(valid.amount * 100),
                },
                quantity: 1,
            };
            const params = {
                payment_method_types: ["card"],
                line_items: [lineItem],
                mode: "payment",
                success_url: valid.successUrl,
                cancel_url: valid.cancelUrl,
            };
            if (valid.agencyAccountId) {
                params.payment_intent_data = {
                    application_fee_amount: valid.commissionAmount
                        ? Math.round(valid.commissionAmount * 100)
                        : undefined,
                    transfer_data: { destination: valid.agencyAccountId },
                };
            }
            const session = yield this.stripe.checkout.sessions.create(params);
            return { sessionUrl: session.url };
        });
    }
    createMamoPayment(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = CreateMamoPayment_dto_1.CreateMamoPaymentSchema.parse(dto);
            const url = `${this.mamoBaseUrl}/payment_links`;
            const payload = {
                amount: valid.amount,
                currency: valid.currency,
                title: valid.title,
                description: valid.description,
                callback_url: valid.callbackUrl,
                redirect_url: valid.redirectUrl,
                metadata: valid.metadata,
            };
            const resp = yield axios_1.default.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${this.cfg.MAMO_API_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            return { checkoutUrl: resp.data.data.payment_url };
        });
    }
    initiatePayment(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = InitiatePayment_dto_1.InitiatePaymentSchema.parse(dto);
            // Get reservation details to calculate amount and get customer info
            const reservation = yield this.reservationRepo.findById(valid.reservationId);
            if (!reservation) {
                throw new Error("Reservation not found");
            }
            // Calculate total amount from reservation price and extras
            const totalAmount = reservation.price || 0;
            // Create payment record
            const paymentId = (0, uuid_1.v4)();
            const processNumber = `PAY-${Date.now()}`;
            const payment = new Payment_1.Payment(paymentId, processNumber, valid.reservationId, reservation.customerId, reservation.clientId, "reservation", "pending", totalAmount);
            yield this.repo.create(payment);
            // Create payment session based on gateway
            let redirectUrl = "";
            switch (valid.gateway) {
                case "stripe":
                    const stripeSession = yield this.createStripeSessionForPayment(totalAmount, reservation, valid, paymentId);
                    redirectUrl = stripeSession.sessionUrl;
                    break;
                case "tamara":
                    const tamaraSession = yield this.createTamaraSessionForPayment(totalAmount, reservation, valid);
                    redirectUrl = tamaraSession.redirectUrl;
                    break;
                case "mimo":
                    const mimoSession = yield this.createMimoSessionForPayment(totalAmount, reservation, valid);
                    redirectUrl = mimoSession.redirectUrl;
                    break;
                default:
                    throw new Error(`Unsupported payment gateway: ${valid.gateway}`);
            }
            return {
                paymentId,
                redirectUrl,
                status: "pending"
            };
        });
    }
    createStripeSessionForPayment(amount, reservation, dto, paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lineItem = {
                price_data: {
                    currency: "USD",
                    product_data: { name: "Travel Reservation" },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            };
            const params = {
                payment_method_types: ["card"],
                line_items: [lineItem],
                mode: "payment",
                success_url: dto.successUrl || `${this.cfg.FRONTEND_URL}/payment/success`,
                cancel_url: dto.cancelUrl || `${this.cfg.FRONTEND_URL}/payment/cancel`,
                metadata: {
                    paymentId: paymentId,
                    reservationId: reservation.id,
                },
                payment_intent_data: {
                    metadata: {
                        paymentId: paymentId,
                        reservationId: reservation.id,
                    },
                },
            };
            const session = yield this.stripe.checkout.sessions.create(params);
            return { sessionUrl: session.url };
        });
    }
    createTamaraSessionForPayment(amount, reservation, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.tamaraBaseUrl}/orders`;
            const Customer = yield this.customerService.findById(reservation.customerId);
            const payload = {
                totalAmount: {
                    amount: Number(amount),
                    currency: "AED"
                },
                shippingAmount: {
                    amount: Number(amount),
                    currency: "AED"
                },
                taxAmount: {
                    amount: Number(amount),
                    currency: "AED"
                },
                orderReferenceId: reservation.id,
                orderNumber: reservation.reservationNumber,
                items: [{
                        name: "Flight Reservation",
                        type: reservation.category || "flight",
                        referenceId: reservation.id,
                        sku: `RES-${reservation.id}`,
                        quantity: 1,
                        unitPrice: {
                            amount: Number(amount),
                            currency: "AED"
                        },
                        totalAmount: {
                            amount: Number(amount),
                            currency: "AED"
                        },
                        taxAmount: {
                            amount: Number(amount),
                            currency: "AED"
                        },
                        itemUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                    }],
                consumer: {
                    email: Customer.email || "customer@example.com",
                    firstName: Customer.firstName || "Customer",
                    lastName: Customer.lastName || "",
                    phoneNumber: Customer.phoneNumber || ""
                },
                countryCode: "AE",
                merchantUrl: {
                    cancel: "https://example.com/cancel",
                    failure: "https://example.com/failure",
                    success: "https://example.com/success",
                    notification: "https://example.com/notify"
                },
                paymentType: "FULL_PAYMENT",
                shippingAddress: {
                    firstName: (Customer === null || Customer === void 0 ? void 0 : Customer.firstName) || "unknown",
                    lastName: (Customer === null || Customer === void 0 ? void 0 : Customer.lastName) || "unknown",
                    line1: Customer.addressLine1 || "unknown",
                    line2: Customer.addressLine2 || "unknown",
                    city: (Customer === null || Customer === void 0 ? void 0 : Customer.city) || "unknown",
                    region: (Customer === null || Customer === void 0 ? void 0 : Customer.country) || "unknown",
                    postalCode: "00000",
                    countryCode: "AE",
                    phoneNumber: Customer.phoneNumber || "0"
                },
                billingAddress: {
                    firstName: (Customer === null || Customer === void 0 ? void 0 : Customer.firstName) || "unknown",
                    lastName: (Customer === null || Customer === void 0 ? void 0 : Customer.lastName) || "unknown",
                    line1: Customer.addressLine1 || "unknown",
                    city: (Customer === null || Customer === void 0 ? void 0 : Customer.city) || "unknown",
                    region: (Customer === null || Customer === void 0 ? void 0 : Customer.country) || "unknown",
                    postalCode: "00000",
                    countryCode: "AE",
                    phoneNumber: Customer.phoneNumber || "0"
                }
            };
            console.log("🔍 tamara payload:", JSON.stringify(payload, null, 2));
            const resp = yield this.tamaraService.createOrder(payload);
            console.log("🔍 tamara response:", JSON.stringify(resp, null, 2));
            // Check the response structure to find the checkout URL
            const checkoutUrl = resp.checkoutUrl;
            if (!checkoutUrl) {
                throw new Error(`Tamara API response does not contain checkout URL. Response: ${JSON.stringify(resp)}`);
            }
            return { redirectUrl: checkoutUrl };
        });
    }
    createMimoSessionForPayment(amount, reservation, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate amount is greater than 0
            if (amount <= 0) {
                throw new Error(`Invalid payment amount: ${amount}. Payment amount must be greater than 0.`);
            }
            // Create proper payload according to Mamo API specification
            const mimoPayload = {
                title: "Travel Reservation Payment",
                amount: amount,
                capture_method: "MANUAL",
                currency: "AED",
                return_url: dto.successUrl || `${this.cfg.FRONTEND_URL}/payment/success`,
            };
            console.log("🔍 Mimo payload:", JSON.stringify(mimoPayload, null, 2));
            const resp = yield this.mimoService.createPaymentLink(mimoPayload);
            console.log("🔍 Mimo response:", JSON.stringify(resp, null, 2));
            // Check the response structure to find the checkout URL
            const checkoutUrl = resp.payment_url || resp.payment_url || resp.url;
            if (!checkoutUrl) {
                throw new Error(`Mamo API response does not contain checkout URL. Response: ${JSON.stringify(resp.data)}`);
            }
            return { redirectUrl: checkoutUrl };
        });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Config)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.PaymentRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CustomerService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ReservationRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.MimoService)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.TamaraService)),
    __metadata("design:paramtypes", [Object, Object, CustomerService_1.CustomerService, Object, mimoService_1.MimoService,
        TamaraService_1.TamaraService])
], PaymentService);
