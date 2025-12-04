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
exports.StripeController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const validation_middleware_1 = require("../middleware/validation.middleware");
const sripeService_1 = require("../../application/services/sripeService");
const stripeorder_dto_1 = require("../../application/dto/stripeorder.dto");
const stripe_1 = __importDefault(require("stripe")); // ضروري
let StripeController = class StripeController {
    constructor(stripeService, clientService) {
        this.stripeService = stripeService;
        this.clientService = clientService;
        this.createOrder = [
            (0, validation_middleware_1.validationMiddleware)(stripeorder_dto_1.CreateStripeOrderSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { checkoutUrl } = yield this.stripeService.createOrder(req.body);
                    res.status(201).json({ checkoutUrl });
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.refundOrder = [
            (0, validation_middleware_1.validationMiddleware)(stripeorder_dto_1.RefundStripeOrderSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.stripeService.refundOrder(req.body);
                    res.status(200).json({ message: "Refund processed successfully" });
                }
                catch (err) {
                    console.error("Refund error:", err);
                    next(err);
                }
            }),
        ];
        this.retrieveOrder = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { sessionId } = req.params;
                    const session = yield this.stripeService.retrieveOrder(sessionId);
                    res.status(200).json(session);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.createCustomer = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { email } = req.body;
                    const customer = yield this.stripeService.createCustomer(email);
                    res.status(201).json(customer);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.captureOrder = [
            (0, validation_middleware_1.validationMiddleware)(stripeorder_dto_1.CaptureStripeOrderSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.stripeService.captureOrder(req.body);
                    res.status(200).json({ message: "Order captured successfully" });
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.handleWebhook = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {});
                const signature = req.headers["stripe-signature"];
                const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
                if (!signature || !endpointSecret) {
                    res.status(400).send("Missing signature or endpoint secret");
                    return;
                }
                let event;
                try {
                    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
                }
                catch (err) {
                    console.error("❌ Webhook Error:", err);
                    res.status(400).send(`Webhook Error: ${err.message}`);
                    return;
                }
                try {
                    switch (event.type) {
                        case "checkout.session.completed":
                            const session = event.data.object;
                            console.log("[STRIPE] Webhook event type:", event.type);
                            console.log("[STRIPE] Full session object:", JSON.stringify(session, null, 2));
                            console.log("[STRIPE] Session metadata:", session.metadata);
                            const clientId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.clientId;
                            console.log("[STRIPE] Extracted clientId:", clientId);
                            if (clientId) {
                                yield this.clientService.updateClient(clientId, { subscriptionType: "paid" });
                                console.log(`[STRIPE] ✅ Client ${clientId} subscription updated to paid`);
                            }
                            else {
                                console.warn("[STRIPE] ⚠️ No clientId found in session metadata");
                            }
                            break;
                        case "payment_intent.succeeded":
                            const payment = event.data.object;
                            console.log("✅ Payment succeeded:", payment.id);
                            break;
                        default:
                            console.log(`ℹ️ Unhandled event type: ${event.type}`);
                    }
                    res.status(200).json({ received: true });
                }
                catch (err) {
                    console.error("❌ Webhook handling failed:", err);
                    next(err);
                }
            }),
        ];
    }
};
exports.StripeController = StripeController;
exports.StripeController = StripeController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StripeService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ClientService)),
    __metadata("design:paramtypes", [sripeService_1.StripeService, Object])
], StripeController);
