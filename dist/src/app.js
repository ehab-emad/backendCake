"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const container_1 = require("./shared/di/container");
const types_1 = require("./shared/di/types");
const passport_2 = require("./infrastructure/auth/passport");
const auth_routes_1 = __importDefault(require("./api/routes/auth.routes"));
const app = (0, express_1.default)();
// const whitelist = [
//   "https://dashboard.ticketchamber.com",
// ];
// const corsOptions: cors.CorsOptions = {
//   origin: (incomingOrigin, callback) => {
//     if (!incomingOrigin) return callback(null, true);
//     if (whitelist.includes(incomingOrigin)) {
//       callback(null, true);
//     } else {
//       callback(
//         new Error(
//           `CORS policy violation: origin '${incomingOrigin}' not allowed`
//         ),
//         false
//       );
//     }
//   },
//   credentials: true,
// };
app.use((0, cors_1.default)());
// Stripe webhooks must receive the raw body
app.use("/paymentssss/stripe/webhook", express_1.default.raw({ type: "application/json" }));
// باقي المسارات تستخدم JSON عادي
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const authRepo = container_1.container.get(types_1.TYPES.AuthRepository);
const authService = container_1.container.get(types_1.TYPES.AuthService);
(0, passport_2.initializePassport)(authRepo, authService);
app.use(passport_1.default.initialize());
app.use("/auth", auth_routes_1.default);
app.use("/stripe/webhook", express_1.default.raw({ type: "application/json" }));
app.post("/tamara/webhook", (req, res) => {
    console.log("📩 Webhook received from Tamara:", req.body);
    // هنا ممكن تحط أي لوجيك حسب نوع الـ event
    // مثلاً:
    const { event_type, data } = req.body;
    if (event_type === "order.authorised") {
        console.log("✔️ Order authorised:", data);
    }
    res.status(200).send("Webhook received");
});
const customerRoutes = container_1.container.get(types_1.TYPES.CustomerRoutes);
app.use("/customers", customerRoutes.router);
app.use("/uploads", express_1.default.static("uploads"));
app.use("/clients", container_1.container.get(types_1.TYPES.ClientRoutes).router);
app.use("/employees", container_1.container.get(types_1.TYPES.EmployeeRoutes).router);
// Flight Ratings Routes
app.use("/reservations", container_1.container.get(types_1.TYPES.ReservationRoutes).router);
app.use("/tickets", container_1.container.get(types_1.TYPES.TicketRoutes).router);
app.use("/payments", container_1.container.get(types_1.TYPES.PaymentRoutes).router);
app.use("/summaries", container_1.container.get(types_1.TYPES.SummaryRoutes).router);
app.use("/device-token", container_1.container.get(types_1.TYPES.DeviceTokenRoutes).router);
app.use("/products", container_1.container.get(types_1.TYPES.ProductRoutes).router);
app.use("/paymentss", container_1.container.get(types_1.TYPES.TamaraRoutes).router);
app.use("/paymentsss", container_1.container.get(types_1.TYPES.MimoRoutes).router);
app.use("/paymentssss", container_1.container.get(types_1.TYPES.StripeRoutes).router);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    // Log the full error stack trace
    console.error(err.stack);
    // Send a proper error response
    res.status(err.status || 500).json({
        error: Object.assign({ message: err.message || 'Internal Server Error' }, (process.env.NODE_ENV === 'development' && { stack: err.stack }))
    });
});
exports.default = app;
