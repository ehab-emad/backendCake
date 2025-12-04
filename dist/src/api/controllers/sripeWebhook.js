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
exports.StripeWebhookController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const ReservationPaymentService_1 = __importDefault(require("../../application/services/ReservationPaymentService"));
const stripe_1 = __importDefault(require("stripe"));
let StripeWebhookController = class StripeWebhookController {
    constructor(reservationPaymentService) {
        this.reservationPaymentService = reservationPaymentService;
        this.handleWebhook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
            const signature = req.headers["stripe-signature"];
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
            if (!signature) {
                console.error("❌ Missing Stripe signature header");
                res.status(400).json({ error: "Missing Stripe signature" });
                return;
            }
            if (!endpointSecret) {
                console.error("❌ Missing Stripe webhook secret in environment");
                res.status(500).json({ error: "Server misconfiguration" });
                return;
            }
            let event;
            try {
                event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
            }
            catch (err) {
                console.error("❌ Webhook signature verification failed:", err.message);
                res.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }
            const eventType = event.type;
            const eventData = event.data.object;
            console.log("📩 Stripe Webhook received:", eventType);
            try {
                // Use ReservationPaymentService to handle the webhook
                yield this.reservationPaymentService.handlePaymentWebhook('stripe', event);
                console.log("✅ Stripe webhook processed successfully");
                res.status(200).json({ received: true });
            }
            catch (error) {
                console.error("❌ Error processing Stripe webhook:", error);
                res.status(500).json({ error: "Error processing webhook" });
            }
        });
    }
};
exports.StripeWebhookController = StripeWebhookController;
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ReservationPaymentService)),
    __metadata("design:paramtypes", [ReservationPaymentService_1.default])
], StripeWebhookController);
