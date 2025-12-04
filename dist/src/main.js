"use strict";
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
exports.app = void 0;
const app_1 = __importDefault(require("./app"));
exports.app = app_1.default;
const database_config_1 = require("./infrastructure/config/database.config");
const client_1 = require("./infrastructure/stripe/client");
const client_2 = require("./infrastructure/tamara/client");
const PORT = process.env.PORT || 3000;
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_config_1.AppDataSource.initialize()
            .then(() => {
            console.log("Data Source initialized ✅");
            console.log("Loaded entities:", database_config_1.AppDataSource.entityMetadatas.map((e) => e.name));
        })
            .catch((err) => {
            console.error("Data Source initialization error ❌:", err);
        });
        app_1.default.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            registerTamaraWebhook();
            registerStripeWebhook();
        });
    });
}
bootstrap().catch((err) => {
    console.error("Application startup failed:", err);
    process.exit(1);
});
function registerTamaraWebhook() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tamaraClient = new client_2.TamaraClient();
            const webhookUrl = "https://36fb-156-198-90-65.ngrok-free.app/tamara/webhook";
            const response = yield tamaraClient.registerWebhook({
                url: webhookUrl,
                events: ["order_approved", "order_authorised", "order_captured"],
            });
            console.log("✅ Tamara webhook registered:", response.data);
        }
        catch (err) {
            if (err.response) {
                console.error("❌ Failed to register Tamara webhook:");
                console.error("Status:", err.response.status);
                console.error("Data:", err.response.data); // ✨ أهم جزء
            }
            else {
                console.error("❌ Unknown error:", err.message || err);
            }
        }
    });
}
function registerStripeWebhook() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stripeClient = new client_1.StripeClient();
            const webhookUrl = "https://f851-156-198-28-213.ngrok-free.app/payment/stripe/webhook"; // ✨ لازم يكون نفس Route اللي معرفه في Routes
            const response = yield stripeClient.createWebhook({
                url: webhookUrl,
                enabled_events: [
                    // Checkout & Payment
                    "checkout.session.completed",
                    "payment_intent.created",
                    "payment_intent.succeeded",
                    "payment_intent.payment_failed",
                    // Charges
                    "charge.succeeded",
                    "charge.refunded",
                    "charge.updated",
                    // Refunds
                    "refund.created",
                    "refund.updated",
                    // Capabilities
                    "capability.updated",
                    // Connected Account Updates
                    "account.updated",
                ],
            });
            console.log("✅ Stripe webhook registered:", response.data);
        }
        catch (err) {
            if (err.response) {
                console.error("❌ Failed to register Stripe webhook:");
                console.error("Status:", err.response.status);
                console.error("Data:", err.response.data);
            }
            else {
                console.error("❌ Unknown error:", err.message || err);
            }
        }
    });
}
