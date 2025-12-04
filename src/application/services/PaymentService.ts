import { injectable, inject } from "inversify";
import Stripe from "stripe";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { IAppConfig } from "../../core/config/IAppConfig";
import { IPaymentRepository } from "../../core/interfaces/repositories/IPaymentRepository";
import { IReservationRepository } from "../../core/interfaces/repositories/IReservationRepository";
import { Payment } from "../../core/entities/Payment";

import {
  CreatePaymentDTO,
  CreatePaymentSchema,
} from "../dto/CreatePayment.dto";
import {
  UpdatePaymentDTO,
  UpdatePaymentSchema,
} from "../dto/UpdatePayment.dto";
import {
  FilterPaymentDTO,
  FilterPaymentSchema,
} from "../dto/FilterPayment.dto";
import {
  CreateStripeSessionDTO,
  CreateStripeSessionSchema,
} from "../dto/StripeSession.dto";
import {
  CreateMamoPaymentDTO,
  CreateMamoPaymentSchema,
} from "../dto/CreateMamoPayment.dto";
import {
  CreateTamaraOrderDTO,
  CreateTamaraOrderSchema,
} from "../dto/TamaraOrder.dto";

import { TYPES } from "../../shared/di/types";

import { MimoService } from './mimoService';
import { CustomerService } from "./CustomerService";
import { TamaraService } from "./TamaraService";
import { InitiatePaymentDTO, InitiatePaymentSchema } from "../dto/InitiatePayment.dto";

@injectable()
export class PaymentService {
  private stripe: Stripe;
  private tamaraBaseUrl: string;
  private mamoBaseUrl: string;

  constructor(
    @inject(TYPES.Config) private cfg: IAppConfig,
    @inject(TYPES.PaymentRepository)
    private readonly repo: IPaymentRepository,
    @inject(TYPES.CustomerService)
        private readonly customerService: CustomerService,
    @inject(TYPES.ReservationRepository)
    private readonly reservationRepo: IReservationRepository,
    @inject(TYPES.MimoService)
    private readonly mimoService: MimoService,
    @inject(TYPES.TamaraService)
    private readonly tamaraService: TamaraService
  ) {
    this.stripe = new Stripe(cfg.STRIPE_SECRET_KEY);
    this.tamaraBaseUrl = cfg.TAMARA_BASE_URL;
    this.mamoBaseUrl = cfg.MAMO_BASE_URL;
  }

  public async createPayment(dto: CreatePaymentDTO): Promise<Payment> {
    const valid = CreatePaymentSchema.parse(dto);
    const id = uuid();
    const procNum = `PROC-${Date.now()}`;
    const p = new Payment(
      id,
      procNum,
      valid.reservationId ?? null,
      valid.customerId ?? null,
      valid.clientId ?? null,
      valid.category,
      valid.transactionStatus,
      valid.amount
    );
    await this.repo.create(p);
    return p;
  }

  public async listPayments(filters: FilterPaymentDTO) {
    const f = FilterPaymentSchema.parse(filters);
    const [data, total] = await this.repo.findAndCount(f);
    return {
      data,
      total,
      page: f.page ?? 1,
      limit: f.limit ?? 20,
    };
  }

  public async getPayment(id: string): Promise<Payment> {
    const p = await this.repo.findById(id);
    if (!p) throw new Error("Payment not found");
    return p;
  }

  public async updatePayment(
    id: string,
    dto: UpdatePaymentDTO
  ): Promise<Payment> {
    const valid = UpdatePaymentSchema.parse(dto);
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("Payment not found");
    Object.assign(existing, valid);
    await this.repo.update(existing);
    return existing;
  }

  public async deletePayment(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  public async createStripeSession(
    dto: CreateStripeSessionDTO
  ): Promise<{ sessionUrl: string }> {
    const valid = CreateStripeSessionSchema.parse(dto);

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: valid.currency,
        product_data: { name: "Travel purchase" },
        unit_amount: Math.round(valid.amount * 100),
      },
      quantity: 1,
    };

    const params: Stripe.Checkout.SessionCreateParams = {
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

    const session = await this.stripe.checkout.sessions.create(params);
    return { sessionUrl: session.url! };
  }

  public async createMamoPayment(
    dto: CreateMamoPaymentDTO
  ): Promise<{ checkoutUrl: string }> {
    const valid = CreateMamoPaymentSchema.parse(dto);
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

    const resp = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${this.cfg.MAMO_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return { checkoutUrl: resp.data.data.payment_url };
  }

  public async initiatePayment(
    dto: InitiatePaymentDTO
  ): Promise<{ paymentId: string; redirectUrl: string; status: string }> {
    const valid = InitiatePaymentSchema.parse(dto);

    // Get reservation details to calculate amount and get customer info
    const reservation = await this.reservationRepo.findById(valid.reservationId);
    if (!reservation) {
      throw new Error("Reservation not found");
    }

    // Calculate total amount from reservation price and extras
    const totalAmount = reservation.price || 0;

    // Create payment record
    const paymentId = uuid();
    const processNumber = `PAY-${Date.now()}`;

    const payment = new Payment(
      paymentId,
      processNumber,
      valid.reservationId,
      reservation.customerId,
      reservation.clientId,
      "reservation",
      "pending",
      totalAmount
    );

    await this.repo.create(payment);

    // Create payment session based on gateway
    let redirectUrl = "";
    switch (valid.gateway) {
      case "stripe":
        const stripeSession = await this.createStripeSessionForPayment(
          totalAmount,
          reservation,
          valid,
          paymentId
        );
        redirectUrl = stripeSession.sessionUrl;
        break;
      case "tamara":
        const tamaraSession = await this.createTamaraSessionForPayment(
          totalAmount,
          reservation,
          valid
        );
        redirectUrl = tamaraSession.redirectUrl;
        break;
      case "mimo":
        const mimoSession = await this.createMimoSessionForPayment(
          totalAmount,
          reservation,
          valid
        );
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
  }

  private async createStripeSessionForPayment(
    amount: number,
    reservation: any,
    dto: InitiatePaymentDTO,
    paymentId: string
  ): Promise<{ sessionUrl: string }> {
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "USD",
        product_data: { name: "Travel Reservation" },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    };

    const params: Stripe.Checkout.SessionCreateParams = {
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

    const session = await this.stripe.checkout.sessions.create(params);
    return { sessionUrl: session.url! };
  }

  private async createTamaraSessionForPayment(
    amount: number,
    reservation: any,
    dto: InitiatePaymentDTO
  ): Promise<{ redirectUrl: string }> {
    const url = `${this.tamaraBaseUrl}/orders`;
    const Customer = await this.customerService.findById(reservation.customerId)
    const payload: CreateTamaraOrderDTO = {
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
      paymentType: "FULL_PAYMENT" as const,
      shippingAddress: {
        firstName: Customer?.firstName || "unknown",
        lastName: Customer?.lastName || "unknown",
        line1: Customer.addressLine1 || "unknown",
        line2: Customer.addressLine2 || "unknown",
        city: Customer?.city || "unknown",
        region: Customer?.country || "unknown",
        postalCode: "00000",
        countryCode: "AE",
        phoneNumber: Customer.phoneNumber || "0"
      },
      billingAddress: {
        firstName: Customer?.firstName || "unknown",
        lastName: Customer?.lastName || "unknown",
        line1: Customer.addressLine1 || "unknown",
        city: Customer?.city || "unknown",
        region: Customer?.country || "unknown",
        postalCode: "00000",
        countryCode: "AE",
        phoneNumber: Customer.phoneNumber || "0"
      }
    };
    console.log("🔍 tamara payload:", JSON.stringify(payload, null, 2));
    const resp = await this.tamaraService.createOrder(payload);
    console.log("🔍 tamara response:", JSON.stringify(resp, null, 2));

    // Check the response structure to find the checkout URL
    const checkoutUrl = resp.checkoutUrl;

    if (!checkoutUrl) {
      throw new Error(`Tamara API response does not contain checkout URL. Response: ${JSON.stringify(resp)}`);
    }

    return { redirectUrl: checkoutUrl };
  }

  private async createMimoSessionForPayment(
    amount: number,
    reservation: any,
    dto: InitiatePaymentDTO
  ): Promise<{ redirectUrl: string }> {
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

    const resp = await this.mimoService.createPaymentLink(mimoPayload);

    console.log("🔍 Mimo response:", JSON.stringify(resp, null, 2));

    // Check the response structure to find the checkout URL
    const checkoutUrl = resp.payment_url || resp.payment_url || resp.url;

    if (!checkoutUrl) {
      throw new Error(`Mamo API response does not contain checkout URL. Response: ${JSON.stringify(resp.data)}`);
    }

    return { redirectUrl: checkoutUrl };
  }
}
