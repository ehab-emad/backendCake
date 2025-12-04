import app from "./app";
import { AppDataSource } from "./infrastructure/config/database.config";
import { StripeClient } from "./infrastructure/stripe/client";
import { TamaraClient } from "./infrastructure/tamara/client";


const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await AppDataSource.initialize()
    .then(() => {
      console.log("Data Source initialized ✅");
      console.log(
        "Loaded entities:",
        AppDataSource.entityMetadatas.map((e) => e.name)
      );
    })
    .catch((err) => {
      console.error("Data Source initialization error ❌:", err);
    });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    registerTamaraWebhook();
    
registerStripeWebhook();
  });
}

bootstrap().catch((err) => {
  console.error("Application startup failed:", err);
  process.exit(1);
});

async function registerTamaraWebhook() {
  try {
    const tamaraClient = new TamaraClient();

    const webhookUrl = "https://36fb-156-198-90-65.ngrok-free.app/tamara/webhook";

    const response = await tamaraClient.registerWebhook({
      url: webhookUrl,
    events: ["order_approved", "order_authorised", "order_captured"],
    });

    console.log("✅ Tamara webhook registered:", response.data);

  } catch (err: any) {
    if (err.response) {
      console.error("❌ Failed to register Tamara webhook:");
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data); // ✨ أهم جزء
    } else {
      console.error("❌ Unknown error:", err.message || err);
    }
  }
}


async function registerStripeWebhook() {
  try {
    const stripeClient = new StripeClient();

    const webhookUrl = "https://f851-156-198-28-213.ngrok-free.app/payment/stripe/webhook"; // ✨ لازم يكون نفس Route اللي معرفه في Routes

   const response = await stripeClient.createWebhook({
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
  } catch (err: any) {
    if (err.response) {
      console.error("❌ Failed to register Stripe webhook:");
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("❌ Unknown error:", err.message || err);
    }
  }
}



export { app };