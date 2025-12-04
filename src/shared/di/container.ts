import { Container } from "inversify";
import * as dotenv from "dotenv";
import passport from "passport";
import type { DataSource } from "typeorm";
import { TYPES } from "./types";

import { AppDataSource } from "../../infrastructure/config/database.config";

import { phoneStrategy } from "../../infrastructure/auth/strategies/PhoneStrategy";
import { MimoController } from "../../api/controllers/mimoController";
import { MimoWebhookController } from "../../api/controllers/mimoWebhookController";
import { AuthController } from "../../api/controllers/AuthController";
import { CustomerController } from "../../api/controllers/CustomerController";
import { ClientController } from "../../api/controllers/ClientController";
import { EmployeeController } from "../../api/controllers/EmployeeController";
import { ProductController } from "../../api/controllers/ProductController";
import { ShapeController } from "../../api/controllers/ShapeController";
import { FlavorController } from "../../api/controllers/FlavorController";
import { MaskController } from "../../api/controllers/MaskController";
import { FinalProductController } from "../../api/controllers/FinalProductController";


import { ReservationController } from "../../api/controllers/ReservationController";
import { TicketController } from "../../api/controllers/TicketController";
import { PaymentController } from "../../api/controllers/PaymentController";
import { SummaryController } from "../../api/controllers/SummaryController";
import { DeviceTokenController } from "../../api/controllers/DeviceTokenController";
import { TamaraController } from "../../api/controllers/TamaraController";

import { CustomerRoutes } from "../../api/routes/customer.routes";
import { ClientRoutes } from "../../api/routes/client.routes";
import { EmployeeRoutes } from "../../api/routes/employee.routes";
import { ProductRoutes } from "../../api/routes/product.routes";
import { ShapeRoutes } from "../../api/routes/shapeRoutes";
import { FlavorRoutes } from "../../api/routes/flavorRoutes";
import { MaskRoutes } from "../../api/routes/maskRoutes";
import { FinalProductRoutes } from "../../api/routes/finalProductRoutes";
import { ReservationRoutes } from "../../api/routes/reservation.routes";
import { TicketRoutes } from "../../api/routes/ticket.routes";
import { PaymentRoutes } from "../../api/routes/payment.routes";
import { SummaryRoutes } from "../../api/routes/summary.routes";
import { DeviceTokenRoutes } from "../../api/routes/deviceToken.routes";
import { TamaraRoutes } from "../../api/routes/tamara.routes";

import { AuthService } from "../../application/services/AuthService";
import { CustomerService } from "../../application/services/CustomerService";
import { SmsService } from "../../infrastructure/sms/SmsService";
import { ClientService } from "../../application/services/ClientService";
import { EmployeeService } from "../../application/services/EmployeeService";
import { NotificationService } from "../../application/services/NotificationService";
import { TicketMessageService } from "../../application/services/TicketMessageService";
import { MimoService } from "../../application/services/mimoService";
import { IReservationService } from "../../core/interfaces/services/IReservationService";
import { ReservationService } from "../../application/services/ReservationService";
import { ReservationPaymentService } from "../../application/services/ReservationPaymentService";
import { SummaryService } from "../../application/services/SummaryService";
import { TamaraService } from "../../application/services/TamaraService";
import { PaymentService } from "../../application/services/PaymentService";
import { TicketService } from "../../application/services/TicketService";
import { ProductService } from "../../application/services/ProductService";
import { ShapeService } from "../../application/services/ShapeService";
import { FlavorService } from "../../application/services/FlavorService";
import { MaskService } from "../../application/services/MaskService";
import { FinalProductService } from "../../application/services/FinalProductService";


import { AuthRepository } from "../../infrastructure/database/repositories/AuthRepository";
import { CustomerRepository } from "../../infrastructure/database/repositories/CustomerRepository";
import { OtpRepository } from "../../infrastructure/database/repositories/OtpRepository";
import { ClientRepository } from "../../infrastructure/database/repositories/ClientRepository";
import { ClientAttachmentRepository } from "../../infrastructure/database/repositories/ClientAttachmentRepository";
import { EmployeeRepository } from "../../infrastructure/database/repositories/EmployeeRepository";
import { EmployeeImageRepository } from "../../infrastructure/database/repositories/EmployeeImageRepository";
import { ProductRepository } from "../../infrastructure/database/repositories/ProductRepository";
import { ShapeRepository } from "../../infrastructure/database/repositories/ShapeRepository";
import { FlavorRepository } from "../../infrastructure/database/repositories/FlavorRepository";
import { MaskRepository } from "../../infrastructure/database/repositories/MaskRepository";
import { FinalProductRepository } from "../../infrastructure/database/repositories/FinalProductRepository";
import { ProductImageRepository } from "../../infrastructure/database/repositories/ProductImageRepository";
import { ProductRatingRepository } from "../../infrastructure/database/repositories/ProductRatingRepository";
import { IProductRepository } from "../../core/interfaces/repositories/IProductRepository";
import { IShapeRepository } from "../../core/interfaces/repositories/IShapeRepository";
import { IFlavorRepository } from "../../core/interfaces/repositories/IFlavorRepository";
import { IMaskRepository } from "../../core/interfaces/repositories/IMaskRepository";
import { IFinalProductRepository } from "../../core/interfaces/repositories/IFinalProductRepository";
import { IProductImageRepository } from "../../core/interfaces/repositories/IProductImageRepository";
import { IProductRatingRepository } from "../../core/interfaces/repositories/IProductRatingRepository";
import { ReservationRepository } from "../../infrastructure/database/repositories/ReservationRepository";
import { TicketRepository } from "../../infrastructure/database/repositories/TicketRepository";
import { PaymentRepository } from "../../infrastructure/database/repositories/PaymentRepository";
import { DeviceTokenRepository } from "../../infrastructure/database/repositories/DeviceTokenRepository";
import { TicketMessageRepository } from "../../infrastructure/database/repositories/TicketMessageRepository";
import { TamaraWebhookController } from "../../api/controllers/TamaraWebhookController";

import { IAppConfig } from "../../core/config/IAppConfig";
import { IClientRepository } from "../../core/interfaces/repositories/IClientRepository";
import { IClientAttachmentRepository } from "../../core/interfaces/repositories/IClientAttachmentRepository";
import { IReservationRepository } from "../../core/interfaces/repositories/IReservationRepository";
import { ITicketRepository } from "../../core/interfaces/repositories/ITicketRepository";
import { IPaymentRepository } from "../../core/interfaces/repositories/IPaymentRepository";
import { IDeviceTokenRepository } from "../../core/interfaces/repositories/IDeviceTokenRepository";
import { ITicketMessageRepository } from "../../core/interfaces/repositories/ITicketMessageRepository";
import { MimoRoutes } from "../../api/routes/mimo.routes";
import { StripeService } from "../../application/services/sripeService";
import { StripeRoutes } from "../../api/routes/stripe.routes";
import { StripeWebhookController } from "../../api/controllers/sripeWebhook";
import { StripeController } from "../../api/controllers/StripeController";

dotenv.config();
const container = new Container();

const config: IAppConfig = {
  APP_URL: process.env.APP_URL!,

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

  SESSION_SECRET: process.env.SESSION_SECRET!,

  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,

  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID!,

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  MAMO_API_KEY: process.env.MAMO_API_KEY!,

  TAMARA_BASE_URL: process.env.TAMARA_BASE_URL!,
  MAMO_BASE_URL: process.env.MAMO_BASE_URL!,

  TAMARA_API_TOKEN: process.env.TAMARA_API_TOKEN!,

  VONAGE_API_KEY: process.env.VONAGE_API_KEY!,
  VONAGE_API_SECRET: process.env.VONAGE_API_SECRET!,
  VONAGE_BRAND_NAME: process.env.VONAGE_BRAND_NAME!,
};
container.bind<IAppConfig>(TYPES.Config).toConstantValue(config);

container.bind(TYPES.AuthRepository).to(AuthRepository).inSingletonScope();
container
  .bind(TYPES.CustomerRepository)
  .to(CustomerRepository)
  .inSingletonScope();
container.bind(TYPES.OtpRepository).to(OtpRepository).inSingletonScope();
container
  .bind<IProductRepository>(TYPES.IProductRepository)
  .to(ProductRepository)
  .inSingletonScope();
container
  .bind<IShapeRepository>(TYPES.IShapeRepository)
  .to(ShapeRepository)
  .inSingletonScope();
container
  .bind<IFlavorRepository>(TYPES.IFlavorRepository)
  .to(FlavorRepository)
  .inSingletonScope();
container
  .bind<IMaskRepository>(TYPES.IMaskRepository)
  .to(MaskRepository)
  .inSingletonScope();
container
  .bind<IFinalProductRepository>(TYPES.IFinalProductRepository)
  .to(FinalProductRepository)
  .inSingletonScope();
container
  .bind(TYPES.ProductImageRepository)
  .to(ProductImageRepository)
  .inSingletonScope();
container
  .bind(TYPES.ProductRatingRepository)
  .to(ProductRatingRepository)
  .inSingletonScope();
container.bind<StripeService>(TYPES.StripeService).to(StripeService);
container.bind<StripeController>(TYPES.StripeController).to(StripeController);

container
  .bind<IClientRepository>(TYPES.ClientRepository)
  .to(ClientRepository)
  .inSingletonScope();

container
  .bind(TYPES.EmployeeRepository)
  .to(EmployeeRepository)
  .inSingletonScope();

container
  .bind(TYPES.EmployeeImageRepository)
  .to(EmployeeImageRepository)
  .inSingletonScope();

container
  .bind<IClientAttachmentRepository>(TYPES.ClientAttachmentRepository)
  .to(ClientAttachmentRepository)
  .inSingletonScope();
container.bind<TamaraWebhookController>(TYPES.TamaraWebhookController).to(TamaraWebhookController);

container
  .bind<IReservationRepository>(TYPES.ReservationRepository)
  .to(ReservationRepository)
  .inSingletonScope();

container
  .bind<ITicketRepository>(TYPES.TicketRepository)
  .to(TicketRepository)
  .inSingletonScope();

container
  .bind<IPaymentRepository>(TYPES.PaymentRepository)
  .to(PaymentRepository)
  .inSingletonScope();

container
  .bind<IDeviceTokenRepository>(TYPES.DeviceTokenRepository)
  .to(DeviceTokenRepository)
  .inSingletonScope();

container
  .bind<ITicketMessageRepository>(TYPES.TicketMessageRepository)
  .to(TicketMessageRepository)
  .inSingletonScope();

container.bind(TYPES.AuthService).to(AuthService);
container.bind(TYPES.CustomerService).to(CustomerService);
container.bind(TYPES.SmsService).to(SmsService);
container.bind<ClientService>(TYPES.ClientService).to(ClientService);

container.bind<EmployeeService>(TYPES.EmployeeService).to(EmployeeService);
container.bind<ProductService>(TYPES.ProductService).to(ProductService);
container.bind<ShapeService>(TYPES.ShapeService).to(ShapeService);
container.bind<FlavorService>(TYPES.FlavorService).to(FlavorService);
container.bind<MaskService>(TYPES.MaskService).to(MaskService);
container.bind<FinalProductService>(TYPES.FinalProductService).to(FinalProductService);

container.bind<TicketService>(TYPES.TicketService).to(TicketService).inSingletonScope();

container.bind<PaymentService>(TYPES.PaymentService).to(PaymentService).inSingletonScope();

container.bind<NotificationService>(TYPES.NotificationService)
  .to(NotificationService)
  .inSingletonScope();

container
  .bind<TamaraService>(TYPES.TamaraService)
  .to(TamaraService)
  .inSingletonScope();
container.bind<MimoService>(TYPES.MimoService).to(MimoService);
container.bind<MimoController>(TYPES.MimoController).to(MimoController);

container
  .bind<MimoWebhookController>(TYPES.MimoWebhookController)
  .to(MimoWebhookController);

container.bind(TYPES.AuthController).to(AuthController);
container.bind(TYPES.CustomerController).to(CustomerController);
container.bind(TYPES.ClientController).to(ClientController);

container
  .bind<EmployeeController>(TYPES.EmployeeController)
  .to(EmployeeController);

container.bind<ProductController>(TYPES.ProductController).to(ProductController);
container.bind<ShapeController>(TYPES.ShapeController).to(ShapeController);
container.bind<FlavorController>(TYPES.FlavorController).to(FlavorController);
container.bind<MaskController>(TYPES.MaskController).to(MaskController);
container.bind<FinalProductController>(TYPES.FinalProductController).to(FinalProductController);

container
  .bind<ReservationController>(TYPES.ReservationController)
  .to(ReservationController);

container.bind<TicketController>(TYPES.TicketController).to(TicketController);

container
  .bind<PaymentController>(TYPES.PaymentController)
  .to(PaymentController);

container
  .bind<SummaryController>(TYPES.SummaryController)
  .to(SummaryController);

container
  .bind<DeviceTokenController>(TYPES.DeviceTokenController)
  .to(DeviceTokenController);

container.bind<TamaraController>(TYPES.TamaraController).to(TamaraController);

container
  .bind<CustomerRoutes>(TYPES.CustomerRoutes)
  .to(CustomerRoutes)
  .inSingletonScope();
container
  .bind<ClientRoutes>(TYPES.ClientRoutes)
  .to(ClientRoutes)
  .inSingletonScope();
container
  .bind<EmployeeRoutes>(TYPES.EmployeeRoutes)
  .to(EmployeeRoutes)
  .inSingletonScope();
container
  .bind<ProductRoutes>(TYPES.ProductRoutes)
  .to(ProductRoutes)
  .inSingletonScope();
container
  .bind<ShapeRoutes>(TYPES.ShapeRoutes)
  .to(ShapeRoutes)
  .inSingletonScope();
container
  .bind<FlavorRoutes>(TYPES.FlavorRoutes)
  .to(FlavorRoutes)
  .inSingletonScope();
container
  .bind<MaskRoutes>(TYPES.MaskRoutes)
  .to(MaskRoutes)
  .inSingletonScope();
container
  .bind<FinalProductRoutes>(TYPES.FinalProductRoutes)
  .to(FinalProductRoutes)
  .inSingletonScope();
container
  .bind<ReservationRoutes>(TYPES.ReservationRoutes)
  .to(ReservationRoutes)
  .inSingletonScope();
container
  .bind<TicketRoutes>(TYPES.TicketRoutes)
  .to(TicketRoutes)
  .inSingletonScope();
container
  .bind<PaymentRoutes>(TYPES.PaymentRoutes)
  .to(PaymentRoutes)
  .inSingletonScope();
container
  .bind<SummaryRoutes>(TYPES.SummaryRoutes)
  .to(SummaryRoutes)
  .inSingletonScope();
container
  .bind<DeviceTokenRoutes>(TYPES.DeviceTokenRoutes)
  .to(DeviceTokenRoutes)
  .inSingletonScope();
container
  .bind<MimoRoutes>(TYPES.MimoRoutes)
  .to(MimoRoutes)
  .inSingletonScope();
  container
  .bind<StripeRoutes>(TYPES.StripeRoutes)
  .to(StripeRoutes)
  .inSingletonScope();
   container
  .bind<TamaraRoutes>(TYPES.TamaraRoutes)
  .to(TamaraRoutes)
  .inSingletonScope();
  

container.bind<DataSource>("DataSource").toConstantValue(AppDataSource);

container
  .bind<TicketMessageService>(TYPES.TicketMessageService)
  .to(TicketMessageService)
  .inSingletonScope();

container.bind<IReservationService>(TYPES.IReservationService).to(ReservationService).inSingletonScope();
container.bind<ReservationService>(TYPES.ReservationService).to(ReservationService).inSingletonScope();
container.bind<ReservationPaymentService>(TYPES.ReservationPaymentService).to(ReservationPaymentService).inSingletonScope();
container.bind<SummaryService>(TYPES.SummaryService).to(SummaryService).inSingletonScope();

const authSvc = container.get<AuthService>(TYPES.AuthService);
passport.use(phoneStrategy(authSvc));

container.bind<StripeWebhookController>(TYPES.StripeWebhookController).to(StripeWebhookController).inSingletonScope();

export { container };