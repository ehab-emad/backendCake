"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const dotenv = __importStar(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const types_1 = require("./types");
const database_config_1 = require("../../infrastructure/config/database.config");
const PhoneStrategy_1 = require("../../infrastructure/auth/strategies/PhoneStrategy");
const mimoController_1 = require("../../api/controllers/mimoController");
const mimoWebhookController_1 = require("../../api/controllers/mimoWebhookController");
const AuthController_1 = require("../../api/controllers/AuthController");
const CustomerController_1 = require("../../api/controllers/CustomerController");
const ClientController_1 = require("../../api/controllers/ClientController");
const EmployeeController_1 = require("../../api/controllers/EmployeeController");
const ProductController_1 = require("../../api/controllers/ProductController");
const ReservationController_1 = require("../../api/controllers/ReservationController");
const TicketController_1 = require("../../api/controllers/TicketController");
const PaymentController_1 = require("../../api/controllers/PaymentController");
const SummaryController_1 = require("../../api/controllers/SummaryController");
const DeviceTokenController_1 = require("../../api/controllers/DeviceTokenController");
const TamaraController_1 = require("../../api/controllers/TamaraController");
const customer_routes_1 = require("../../api/routes/customer.routes");
const client_routes_1 = require("../../api/routes/client.routes");
const employee_routes_1 = require("../../api/routes/employee.routes");
const product_routes_1 = require("../../api/routes/product.routes");
const reservation_routes_1 = require("../../api/routes/reservation.routes");
const ticket_routes_1 = require("../../api/routes/ticket.routes");
const payment_routes_1 = require("../../api/routes/payment.routes");
const summary_routes_1 = require("../../api/routes/summary.routes");
const deviceToken_routes_1 = require("../../api/routes/deviceToken.routes");
const tamara_routes_1 = require("../../api/routes/tamara.routes");
const AuthService_1 = require("../../application/services/AuthService");
const CustomerService_1 = require("../../application/services/CustomerService");
const SmsService_1 = require("../../infrastructure/sms/SmsService");
const ClientService_1 = require("../../application/services/ClientService");
const EmployeeService_1 = require("../../application/services/EmployeeService");
const NotificationService_1 = require("../../application/services/NotificationService");
const TicketMessageService_1 = require("../../application/services/TicketMessageService");
const mimoService_1 = require("../../application/services/mimoService");
const ReservationService_1 = require("../../application/services/ReservationService");
const ReservationPaymentService_1 = require("../../application/services/ReservationPaymentService");
const SummaryService_1 = require("../../application/services/SummaryService");
const TamaraService_1 = require("../../application/services/TamaraService");
const PaymentService_1 = require("../../application/services/PaymentService");
const TicketService_1 = require("../../application/services/TicketService");
const ProductService_1 = require("../../application/services/ProductService");
const AuthRepository_1 = require("../../infrastructure/database/repositories/AuthRepository");
const CustomerRepository_1 = require("../../infrastructure/database/repositories/CustomerRepository");
const OtpRepository_1 = require("../../infrastructure/database/repositories/OtpRepository");
const ClientRepository_1 = require("../../infrastructure/database/repositories/ClientRepository");
const ClientAttachmentRepository_1 = require("../../infrastructure/database/repositories/ClientAttachmentRepository");
const EmployeeRepository_1 = require("../../infrastructure/database/repositories/EmployeeRepository");
const EmployeeImageRepository_1 = require("../../infrastructure/database/repositories/EmployeeImageRepository");
const ProductRepository_1 = require("../../infrastructure/database/repositories/ProductRepository");
const ProductImageRepository_1 = require("../../infrastructure/database/repositories/ProductImageRepository");
const ProductRatingRepository_1 = require("../../infrastructure/database/repositories/ProductRatingRepository");
const ReservationRepository_1 = require("../../infrastructure/database/repositories/ReservationRepository");
const TicketRepository_1 = require("../../infrastructure/database/repositories/TicketRepository");
const PaymentRepository_1 = require("../../infrastructure/database/repositories/PaymentRepository");
const DeviceTokenRepository_1 = require("../../infrastructure/database/repositories/DeviceTokenRepository");
const TicketMessageRepository_1 = require("../../infrastructure/database/repositories/TicketMessageRepository");
const TamaraWebhookController_1 = require("../../api/controllers/TamaraWebhookController");
const mimo_routes_1 = require("../../api/routes/mimo.routes");
const sripeService_1 = require("../../application/services/sripeService");
const stripe_routes_1 = require("../../api/routes/stripe.routes");
const sripeWebhook_1 = require("../../api/controllers/sripeWebhook");
const StripeController_1 = require("../../api/controllers/StripeController");
dotenv.config();
const container = new inversify_1.Container();
exports.container = container;
const config = {
    APP_URL: process.env.APP_URL,
    BACKEND_URL: process.env.BACKEND_URL || process.env.APP_URL || "http://localhost:8000",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    PORT: parseInt(process.env.PORT || "3000", 10),
    NODE_ENV: process.env.NODE_ENV || "development",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: parseInt(process.env.DB_PORT || "3306", 10),
    DB_USER: process.env.DB_USER || "root",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_NAME: process.env.DB_NAME || "ticket",
    DB_LOGGING: process.env.DB_LOGGING === "true",
    SESSION_SECRET: process.env.SESSION_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    MAMO_API_KEY: process.env.MAMO_API_KEY,
    TAMARA_BASE_URL: process.env.TAMARA_BASE_URL,
    MAMO_BASE_URL: process.env.MAMO_BASE_URL,
    TAMARA_API_TOKEN: process.env.TAMARA_API_TOKEN,
    VONAGE_API_KEY: process.env.VONAGE_API_KEY,
    VONAGE_API_SECRET: process.env.VONAGE_API_SECRET,
    VONAGE_BRAND_NAME: process.env.VONAGE_BRAND_NAME,
};
container.bind(types_1.TYPES.Config).toConstantValue(config);
container.bind(types_1.TYPES.AuthRepository).to(AuthRepository_1.AuthRepository).inSingletonScope();
container
    .bind(types_1.TYPES.CustomerRepository)
    .to(CustomerRepository_1.CustomerRepository)
    .inSingletonScope();
container.bind(types_1.TYPES.OtpRepository).to(OtpRepository_1.OtpRepository).inSingletonScope();
container
    .bind(types_1.TYPES.IProductRepository)
    .to(ProductRepository_1.ProductRepository)
    .inSingletonScope();
container
    .bind(types_1.TYPES.ProductImageRepository)
    .to(ProductImageRepository_1.ProductImageRepository)
    .inSingletonScope();
container
    .bind(types_1.TYPES.ProductRatingRepository)
    .to(ProductRatingRepository_1.ProductRatingRepository)
    .inSingletonScope();
container.bind(types_1.TYPES.StripeService).to(sripeService_1.StripeService);
container.bind(types_1.TYPES.StripeController).to(StripeController_1.StripeController);
container
    .bind(types_1.TYPES.ClientRepository)
    .to(ClientRepository_1.ClientRepository)
    .inSingletonScope();
container
    .bind(types_1.TYPES.EmployeeRepository)
    .to(EmployeeRepository_1.EmployeeRepository)
    .inSingletonScope();
container
    .bind(types_1.TYPES.EmployeeImageRepository)
    .to(EmployeeImageRepository_1.EmployeeImageRepository)
    .inSingletonScope();
container
    .bind(types_1.TYPES.ClientAttachmentRepository)
    .to(ClientAttachmentRepository_1.ClientAttachmentRepository)
    .inSingletonScope();
container.bind(types_1.TYPES.TamaraWebhookController).to(TamaraWebhookController_1.TamaraWebhookController);
container
    .bind(types_1.TYPES.ReservationRepository)
    .to(ReservationRepository_1.ReservationRepository)
    .inSingletonScope();
container
    .bind(types_1.TYPES.TicketRepository)
    .to(TicketRepository_1.TicketRepository)
    .inSingletonScope();
container
    .bind(types_1.TYPES.PaymentRepository)
    .to(PaymentRepository_1.PaymentRepository)
    .inSingletonScope();
container
    .bind(types_1.TYPES.DeviceTokenRepository)
    .to(DeviceTokenRepository_1.DeviceTokenRepository)
    .inSingletonScope();
container
    .bind(types_1.TYPES.TicketMessageRepository)
    .to(TicketMessageRepository_1.TicketMessageRepository)
    .inSingletonScope();
container.bind(types_1.TYPES.AuthService).to(AuthService_1.AuthService);
container.bind(types_1.TYPES.CustomerService).to(CustomerService_1.CustomerService);
container.bind(types_1.TYPES.SmsService).to(SmsService_1.SmsService);
container.bind(types_1.TYPES.ClientService).to(ClientService_1.ClientService);
container.bind(types_1.TYPES.EmployeeService).to(EmployeeService_1.EmployeeService);
container.bind(types_1.TYPES.ProductService).to(ProductService_1.ProductService);
container.bind(types_1.TYPES.TicketService).to(TicketService_1.TicketService).inSingletonScope();
container.bind(types_1.TYPES.PaymentService).to(PaymentService_1.PaymentService).inSingletonScope();
container.bind(types_1.TYPES.NotificationService)
    .to(NotificationService_1.NotificationService)
    .inSingletonScope();
container
    .bind(types_1.TYPES.TamaraService)
    .to(TamaraService_1.TamaraService)
    .inSingletonScope();
container.bind(types_1.TYPES.MimoService).to(mimoService_1.MimoService);
container.bind(types_1.TYPES.MimoController).to(mimoController_1.MimoController);
container
    .bind(types_1.TYPES.MimoWebhookController)
    .to(mimoWebhookController_1.MimoWebhookController);
container.bind(types_1.TYPES.AuthController).to(AuthController_1.AuthController);
container.bind(types_1.TYPES.CustomerController).to(CustomerController_1.CustomerController);
container.bind(types_1.TYPES.ClientController).to(ClientController_1.ClientController);
container
    .bind(types_1.TYPES.EmployeeController)
    .to(EmployeeController_1.EmployeeController);
container.bind(types_1.TYPES.ProductController).to(ProductController_1.ProductController);
container
    .bind(types_1.TYPES.ReservationController)
    .to(ReservationController_1.ReservationController);
container.bind(types_1.TYPES.TicketController).to(TicketController_1.TicketController);
container
    .bind(types_1.TYPES.PaymentController)
    .to(PaymentController_1.PaymentController);
container
    .bind(types_1.TYPES.SummaryController)
    .to(SummaryController_1.SummaryController);
container
    .bind(types_1.TYPES.DeviceTokenController)
    .to(DeviceTokenController_1.DeviceTokenController);
container.bind(types_1.TYPES.TamaraController).to(TamaraController_1.TamaraController);
container
    .bind(types_1.TYPES.CustomerRoutes)
    .to(customer_routes_1.CustomerRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.ClientRoutes)
    .to(client_routes_1.ClientRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.EmployeeRoutes)
    .to(employee_routes_1.EmployeeRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.ProductRoutes)
    .to(product_routes_1.ProductRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.ReservationRoutes)
    .to(reservation_routes_1.ReservationRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.TicketRoutes)
    .to(ticket_routes_1.TicketRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.PaymentRoutes)
    .to(payment_routes_1.PaymentRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.SummaryRoutes)
    .to(summary_routes_1.SummaryRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.DeviceTokenRoutes)
    .to(deviceToken_routes_1.DeviceTokenRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.MimoRoutes)
    .to(mimo_routes_1.MimoRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.StripeRoutes)
    .to(stripe_routes_1.StripeRoutes)
    .inSingletonScope();
container
    .bind(types_1.TYPES.TamaraRoutes)
    .to(tamara_routes_1.TamaraRoutes)
    .inSingletonScope();
container.bind("DataSource").toConstantValue(database_config_1.AppDataSource);
container
    .bind(types_1.TYPES.TicketMessageService)
    .to(TicketMessageService_1.TicketMessageService)
    .inSingletonScope();
container.bind(types_1.TYPES.IReservationService).to(ReservationService_1.ReservationService).inSingletonScope();
container.bind(types_1.TYPES.ReservationService).to(ReservationService_1.ReservationService).inSingletonScope();
container.bind(types_1.TYPES.ReservationPaymentService).to(ReservationPaymentService_1.ReservationPaymentService).inSingletonScope();
container.bind(types_1.TYPES.SummaryService).to(SummaryService_1.SummaryService).inSingletonScope();
const authSvc = container.get(types_1.TYPES.AuthService);
passport_1.default.use((0, PhoneStrategy_1.phoneStrategy)(authSvc));
container.bind(types_1.TYPES.StripeWebhookController).to(sripeWebhook_1.StripeWebhookController).inSingletonScope();
