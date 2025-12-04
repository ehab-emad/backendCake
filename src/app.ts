import express from "express";
import cors from "cors";
import passport from "passport";
import { container } from "./shared/di/container";
import type { IAuthRepository } from "./core/interfaces/repositories/IAuthRepository";
import { AuthService } from "./application/services/AuthService";
import { TYPES } from "./shared/di/types";
import { initializePassport } from "./infrastructure/auth/passport";
import authRoutes from "./api/routes/auth.routes";
import { CustomerRoutes } from "./api/routes/customer.routes";
import { ClientRoutes } from "./api/routes/client.routes";
import { EmployeeRoutes } from "./api/routes/employee.routes";
import { ReservationRoutes } from "./api/routes/reservation.routes";
import { TicketRoutes } from "./api/routes/ticket.routes";
import { PaymentRoutes } from "./api/routes/payment.routes";
import { SummaryRoutes } from "./api/routes/summary.routes";
import { DeviceTokenRoutes } from "./api/routes/deviceToken.routes";
import { ProductRoutes } from "./api/routes/product.routes";
import { ShapeRoutes } from "./api/routes/shapeRoutes";
import { FlavorRoutes } from "./api/routes/flavorRoutes";
import { MaskRoutes } from "./api/routes/maskRoutes";
import { FinalProductRoutes } from "./api/routes/finalProductRoutes";

import { TamaraRoutes } from "./api/routes/tamara.routes";
import { MimoRoutes } from "./api/routes/mimo.routes";
import { StripeRoutes } from "./api/routes/stripe.routes";


const app = express();

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

app.use(cors());

// Stripe webhooks must receive the raw body
app.use("/paymentssss/stripe/webhook", express.raw({ type: "application/json" }));


// باقي المسارات تستخدم JSON عادي
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRepo = container.get<IAuthRepository>(TYPES.AuthRepository);
const authService = container.get<AuthService>(TYPES.AuthService);
initializePassport(authRepo, authService);
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/stripe/webhook", express.raw({ type: "application/json" }));
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


const customerRoutes = container.get<CustomerRoutes>(TYPES.CustomerRoutes);
app.use("/customers", customerRoutes.router);

app.use("/uploads", express.static("uploads"));

app.use("/clients", container.get<ClientRoutes>(TYPES.ClientRoutes).router);

app.use(
  "/employees",
  container.get<EmployeeRoutes>(TYPES.EmployeeRoutes).router
);

// Flight Ratings Routes

app.use(
  "/reservations",
  container.get<ReservationRoutes>(TYPES.ReservationRoutes).router
);
app.use("/tickets", container.get<TicketRoutes>(TYPES.TicketRoutes).router);

app.use("/payments", container.get<PaymentRoutes>(TYPES.PaymentRoutes).router);

app.use("/summaries", container.get<SummaryRoutes>(TYPES.SummaryRoutes).router);

app.use(
  "/device-token",
  container.get<DeviceTokenRoutes>(TYPES.DeviceTokenRoutes).router
);

app.use("/products", container.get<ProductRoutes>(TYPES.ProductRoutes).router);

app.use("/shapes", container.get<ShapeRoutes>(TYPES.ShapeRoutes).router);
app.use("/flavors", container.get<FlavorRoutes>(TYPES.FlavorRoutes).router);
app.use("/masks", container.get<MaskRoutes>(TYPES.MaskRoutes).router);
app.use("/final-products", container.get<FinalProductRoutes>(TYPES.FinalProductRoutes).router);

app.use("/tamara", container.get<TamaraRoutes>(TYPES.TamaraRoutes).router);


app.use("/mimo", container.get<MimoRoutes>(TYPES.MimoRoutes).router);
app.use("/stripe", container.get<StripeRoutes>(TYPES.StripeRoutes).router);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  
  // Log the full error stack trace
  console.error(err.stack);
  
  // Send a proper error response
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

export default app;
