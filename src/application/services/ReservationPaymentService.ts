import { injectable, inject } from "inversify";
import { v4 as uuid } from "uuid";
import { IReservationRepository } from "../../core/interfaces/repositories/IReservationRepository";
import { IPaymentRepository } from "../../core/interfaces/repositories/IPaymentRepository";
import { Reservation } from "../../core/entities/Reservation";
import { Payment } from "../../core/entities/Payment";
import { MimoService } from './mimoService';
import { CustomerService } from "./CustomerService";
import { NotificationService } from "./NotificationService";
import { PaymentGateway, PaymentStatus } from "../../core/types/payment.types";
import { TYPES } from "../../shared/di/types";
import { CreateMamoLinkDTO } from '../dto/mimoOrder.dto';

interface ProcessPaymentResult {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  gateway: PaymentGateway;
  amount?: number;
  currency?: string;
  redirectUrl?: string;
  error?: string;
}

@injectable()
export class ReservationPaymentService {
  constructor(
    @inject(TYPES.ReservationRepository)
    private readonly reservationRepo: IReservationRepository,
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepo: IPaymentRepository,
    @inject(TYPES.MimoService)
    private readonly mimoService: MimoService,
    @inject(TYPES.CustomerService)
    private readonly customerService: CustomerService,
    @inject(TYPES.NotificationService)
    private readonly notificationService: NotificationService
  ) {}

  public async processPayment(
    reservationId: string,
    gateway: PaymentGateway,
    paymentDetails: {
      amount: number;
      currency?: string;
      description?: string;
      customerEmail: string;
      metadata?: Record<string, any>;
    }
  ): Promise<ProcessPaymentResult> {
    try {
      const reservation = await this.reservationRepo.findById(reservationId);
      if (!reservation) {
        throw new Error('Reservation not found');
      }

      if (reservation.status !== 'pending') {
        throw new Error(`Cannot process payment for reservation with status: ${reservation.status}`);
      }

      let result: ProcessPaymentResult;
      
      // Route to the appropriate payment gateway
      switch (gateway) {
        case 'stripe':
          result = await this.processStripePayment(reservation, paymentDetails);
          break;
        case 'tamara':
          result = await this.processTamaraPayment(reservation, paymentDetails);
          break;
        case 'mimo':
          result = await this.processMimoPayment(reservation, paymentDetails);
          break;
        default:
          throw new Error(`Unsupported payment gateway: ${gateway}`);
      }

      // Update reservation status based on payment result
      if (result.success && result.status === 'paid') {
        reservation.confirmPayment(
          result.paymentId,
          gateway,
          paymentDetails.amount,
          paymentDetails.currency
        );
      } else if (result.status === 'failed') {
        reservation.markAsFailed();
      }

      // Save the updated reservation
      await this.reservationRepo.update(reservation);

      // Create payment record
      const payment = new Payment(
        result.paymentId,
        `PAY-${Date.now()}`,
        reservationId,
        reservation.customerId,
        reservation.clientId,
        'reservation',
        result.status === 'paid' ? 'paid' : 'under_review',
        paymentDetails.amount,
        new Date()
      );
      
      // Store additional payment details in metadata if needed
      const paymentMetadata = {
        ...paymentDetails.metadata,
        gatewayResponse: result,
        gateway: gateway,
        currency: paymentDetails.currency || 'USD'
      };
      
      // If you need to store metadata, you might need to extend the Payment class or use a separate table
      await this.paymentRepo.create(payment);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Payment processing failed:', errorMessage);
      return {
        success: false,
        paymentId: `err_${Date.now()}`,
        status: 'failed',
        gateway,
        error: errorMessage
      };
    }
  }

  private async processStripePayment(
    reservation: Reservation,
    paymentDetails: {
      amount: number;
      currency?: string;
      description?: string;
      customerEmail: string;
      metadata?: Record<string, any>;
    }
  ): Promise<ProcessPaymentResult> {
    try {
      // In a real implementation, this would call the Stripe API
      // For now, we'll simulate a successful payment
      const paymentId = `stripe_${uuid()}`;
      
      return {
        success: true,
        paymentId,
        status: 'paid',
        gateway: 'stripe',
        redirectUrl: undefined // No redirect needed for immediate payments
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Stripe payment failed';
      console.error('Stripe payment failed:', errorMessage);
      return {
        success: false,
        paymentId: `stripe_err_${uuid()}`,
        status: 'failed',
        gateway: 'stripe',
        error: errorMessage
      };
    }
  }

  private async processTamaraPayment(
    reservation: Reservation,
    paymentDetails: {
      amount: number;
      currency?: string;
      description?: string;
      customerEmail: string;
      metadata?: Record<string, any>;
    }
  ): Promise<ProcessPaymentResult> {
    try {
      // In a real implementation, this would call the Tamara API
      // For now, we'll simulate a successful payment initiation
      const paymentId = `tamara_${uuid()}`;
      
      // Tamara typically requires redirection to their payment page
      return {
        success: true,
        paymentId,
        status: 'pending', // Tamara payments are typically pending until confirmed
        gateway: 'tamara',
        redirectUrl: `https://checkout.tamara.co/checkout/${paymentId}`
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Tamara payment failed';
      console.error('Tamara payment failed:', errorMessage);
      return {
        success: false,
        paymentId: `tamara_err_${uuid()}`,
        status: 'failed',
        gateway: 'tamara',
        error: errorMessage
      };
    }
  }

  private async processMimoPayment(
    reservation: Reservation,
    paymentDetails: {
      amount: number;
      currency?: string;
      description?: string;
      customerEmail: string;
      metadata?: Record<string, any>;
      successUrl?: string;
      cancelUrl?: string;
    }
  ): Promise<ProcessPaymentResult> {
    try {
      // Create mimo payment link data
      const mimoPaymentData: CreateMamoLinkDTO = {
        title: `Reservation Payment - ${reservation.reservationNumber}`,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency || 'AED',
        return_url: paymentDetails.successUrl || `${process.env.FRONTEND_URL}/reservations/${reservation.id}/success`,
        capture_method: 'MANUAL',
        hold_and_charge_later: false
      };

      // Create payment link using MimoService
      const mimoResponse = await this.mimoService.createPaymentLink(mimoPaymentData);
      
      // Extract payment URL from response
      const paymentUrl = mimoResponse?.data?.url || mimoResponse?.url;
      
      if (!paymentUrl) {
        throw new Error('No payment URL returned from Mimo');
      }

      const paymentId = mimoResponse?.data?.id || `mimo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        paymentId,
        status: 'pending',
        gateway: 'mimo',
        redirectUrl: paymentUrl,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency || 'USD'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Mimo payment failed';
      console.error('Mimo payment failed:', errorMessage);
      return {
        success: false,
        paymentId: `mimo_err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'failed',
        gateway: 'mimo',
        error: errorMessage
      };
    }
  }

  private async updateAllPaymentsForReservation(reservationId: string, status: "paid" | "cancelled" | "failed"): Promise<void> {
    try {
      // Get all payments for this reservation
      const payments = await this.paymentRepo.findByReservationId(reservationId);

      // Update the status of all payments
      for (const payment of payments) {
        payment.transactionStatus = status;
        await this.paymentRepo.update(payment);
      }

      console.log(`✅ Updated ${payments.length} payments for reservation ${reservationId} to status: ${status}`);
    } catch (error) {
      console.error(`❌ Error updating payments for reservation ${reservationId}:`, error);
      throw error;
    }
  }

  public async handlePaymentWebhook(
    gateway: PaymentGateway,
    payload: any
  ): Promise<void> {
    try {
      // Route to the appropriate webhook handler
      switch (gateway) {
        case 'stripe':
          await this.handleStripeWebhook(payload);
          break;
        case 'tamara':
          await this.handleTamaraWebhook(payload);
          break;
        case 'mimo':
          await this.handleMimoWebhook(payload);
          break;
        default:
          console.warn(`Unsupported payment gateway for webhook: ${gateway}`);
      }
    } catch (error) {
      console.error(`Error processing ${gateway} webhook:`, error);
      throw error;
    }
  }

  private async handleStripeWebhook(payload: any): Promise<void> {
    try {
      console.log('🔄 Processing Stripe webhook:', JSON.stringify(payload, null, 2));

      // Extract Stripe event data
      const eventType = payload.type;
      const eventData = payload.data?.object;

      if (!eventData) {
        console.warn('⚠️ No event data in Stripe webhook');
        return;
      }

      // Extract payment/session information
      let paymentId: string | null = null;
      let reservationId: string | null = null;
      let paymentStatus: string | null = null;

      // Handle different Stripe event types
      switch (eventType) {
        case 'checkout.session.completed':
          const session = eventData;
          paymentId = session.metadata?.paymentId;
          reservationId = session.metadata?.reservationId;
          paymentStatus = 'completed';
          break;

        case 'payment_intent.succeeded':
          const paymentIntent = eventData;
          paymentStatus = 'succeeded';
          // For payment_intent events, we'll find the payment by processNumber
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = eventData;
          paymentStatus = 'failed';
          break;

        case 'charge.updated':
          const charge = eventData;
          paymentStatus = 'succeeded';
          // For charge events, we'll find the payment by payment_intent ID as processNumber
          break;

        default:
          console.log(`ℹ️ Unhandled Stripe event type: ${eventType}`);
          return;
      }

      // Find the reservation and payment based on available data
      let reservation: any = null;
      let payment: any = null;

      if (reservationId && paymentId) {
        // Case 1: We have both reservationId and paymentId (from checkout.session.completed)
        reservation = await this.reservationRepo.findById(reservationId);
        if (!reservation) {
          console.warn(`⚠️ Reservation not found for ID: ${reservationId}`);
          return;
        }

        // Find the payment record
        const payments = await this.paymentRepo.findByReservationId(reservationId);
        payment = payments.find(p => p.id === paymentId);

        if (!payment) {
          console.warn(`⚠️ Payment not found for reservation ${reservationId} and payment ${paymentId}`);
          return;
        }
      } else {
        // Case 2: We don't have reservationId or paymentId (from payment_intent or charge events)
        // We need to find payment by processNumber (which should match payment_intent.id or charge.id)

        let processNumber = null;
        if (eventType === 'payment_intent.succeeded' || eventType === 'payment_intent.payment_failed') {
          processNumber = eventData.id; // payment_intent.id
        } else if ((eventType === 'charge.succeeded' || eventType === 'charge.updated') && eventData.payment_intent) {
          processNumber = eventData.payment_intent; // payment_intent.id for charge events
        }

        if (processNumber) {
          payment = await this.paymentRepo.findByProcessNumber(processNumber);
          if (!payment) {
            console.warn(`⚠️ Payment not found for processNumber: ${processNumber}`);
            return;
          }

          // Now get the reservation from the payment
          reservation = await this.reservationRepo.findById(payment.reservationId);
          if (!reservation) {
            console.warn(`⚠️ Reservation not found for payment: ${payment.id}`);
            return;
          }
        } else {
          console.warn('⚠️ No processNumber available for payment lookup');
          return;
        }
      }

      // Process based on payment status
      switch (paymentStatus?.toLowerCase()) {
        case 'completed':
        case 'succeeded':
          // Payment successful - confirm the reservation
          reservation.confirmPayment(
            payment.id,
            'stripe',
            payment.amount,
            eventData.currency?.toUpperCase() || 'USD'
          );

          // Update all payments for this reservation to 'paid'
          await this.updateAllPaymentsForReservation(reservation.id, 'paid');
          console.log(`✅ Reservation ${reservation.id} confirmed via Stripe webhook`);

          // Send confirmation notification
          const customer = await this.customerService.findById(reservation.customerId!);
          if (customer?.authUserId) {
            await this.notificationService.sendReservationNotification(
              customer.authUserId,
              'Payment Confirmed',
              `Your payment for reservation ${reservation.reservationNumber} has been confirmed via Stripe.`,
              { reservationId: reservation.id, status: 'confirmed', gateway: 'stripe' }
            );
          }
          break;

        case 'failed':
          // Payment failed - mark reservation as failed
          reservation.markAsFailed();

          // Update all payments for this reservation to 'cancelled'
          await this.updateAllPaymentsForReservation(reservation.id, 'cancelled');
          console.log(`❌ Payment failed for reservation ${reservation.id} via Stripe webhook`);

          // Send failure notification
          const customerFailed = await this.customerService.findById(reservation.customerId!);
          if (customerFailed?.authUserId) {
            await this.notificationService.sendReservationNotification(
              customerFailed.authUserId,
              'Payment Failed',
              `Your payment for reservation ${reservation.reservationNumber} has failed via Stripe. Please try again.`,
              { reservationId: reservation.id, status: 'failed', gateway: 'stripe' }
            );
          }
          break;

        case 'pending':
        case 'processing':
          // Payment still processing - update status but don't change reservation status
          payment.transactionStatus = 'under_review';
          await this.paymentRepo.update(payment);
          console.log(`⏳ Payment ${payment.id} is still processing for reservation ${reservation.id}`);
          break;

        default:
          console.warn(`⚠️ Unknown payment status from Stripe webhook: ${paymentStatus}`);
          break;
      }

      // Update reservation in database
      await this.reservationRepo.update(reservation);

    } catch (error) {
      console.error('❌ Error processing Stripe webhook:', error);
      throw error;
    }
  }

  private async handleTamaraWebhook(payload: any): Promise<void> {
    try {
      console.log('🔄 Processing Tamara webhook:', JSON.stringify(payload, null, 2));

      // Extract Tamara event data
      const eventType = payload.event_type;
      const eventData = payload;

      if (!eventData) {
        console.warn('⚠️ No event data in Tamara webhook');
        return;
      }

      // Extract order/payment information
      let orderId: string | null = null;
      let reservationId: string | null = null;
      let orderStatus: string | null = null;

      // Handle different Tamara event types
      switch (eventType) {
        case 'order.authorised':
          orderId = eventData.order_id || eventData.order_reference_id;
          orderStatus = 'authorised';
          reservationId = eventData.order_reference_id; // Assuming order_reference_id contains reservation ID
          break;

        case 'order.captured':
          orderId = eventData.order_id || eventData.order_reference_id;
          orderStatus = 'captured';
          reservationId = eventData.order_reference_id;
          break;

        case 'order.cancelled':
          orderId = eventData.order_id || eventData.order_reference_id;
          orderStatus = 'cancelled';
          reservationId = eventData.order_reference_id;
          break;

        case 'order.declined':
          orderId = eventData.order_id || eventData.order_reference_id;
          orderStatus = 'declined';
          reservationId = eventData.order_reference_id;
          break;

        case 'order.expired':
          orderId = eventData.order_id || eventData.order_reference_id;
          orderStatus = 'expired';
          reservationId = eventData.order_reference_id;
          break;

        default:
          console.log(`ℹ️ Unhandled Tamara event type: ${eventType}`);
          return;
      }

      if (!orderId || !reservationId) {
        console.warn('⚠️ Missing orderId or reservationId in Tamara webhook');
        return;
      }

      // Find the reservation
      const reservation = await this.reservationRepo.findById(reservationId);
      if (!reservation) {
        console.warn(`⚠️ Reservation not found for ID: ${reservationId}`);
        return;
      }

      // Find the payment record
      const payments = await this.paymentRepo.findByReservationId(reservationId);
      const payment = payments.find(p => p.processNumber.includes(orderId) || p.id === orderId);

      if (!payment) {
        console.warn(`⚠️ Payment not found for reservation ${reservationId} and order ${orderId}`);
        return;
      }

      // Process based on order status
      switch (orderStatus?.toLowerCase()) {
        case 'authorised':
        case 'captured':
          // Payment successful - confirm the reservation
          reservation.confirmPayment(
            payment.id,
            'tamara',
            payment.amount,
            eventData.currency || 'AED'
          );

          // Update all payments for this reservation to 'paid'
          await this.updateAllPaymentsForReservation(reservationId, 'paid');
          console.log(`✅ Reservation ${reservationId} confirmed via Tamara webhook`);

          // Send confirmation notification
          const customer = await this.customerService.findById(reservation.customerId!);
          if (customer?.authUserId) {
            await this.notificationService.sendReservationNotification(
              customer.authUserId,
              'Payment Confirmed',
              `Your payment for reservation ${reservation.reservationNumber} has been confirmed via Tamara.`,
              { reservationId: reservation.id, status: 'confirmed', gateway: 'tamara' }
            );
          }
          break;

        case 'cancelled':
        case 'declined':
        case 'expired':
          // Payment failed - mark reservation as failed
          reservation.markAsFailed();

          // Update all payments for this reservation to 'cancelled'
          await this.updateAllPaymentsForReservation(reservationId, 'cancelled');
          console.log(`❌ Payment ${orderStatus} for reservation ${reservationId} via Tamara webhook`);

          // Send failure notification
          const customerFailed = await this.customerService.findById(reservation.customerId!);
          if (customerFailed?.authUserId) {
            await this.notificationService.sendReservationNotification(
              customerFailed.authUserId,
              'Payment Failed',
              `Your payment for reservation ${reservation.reservationNumber} has ${orderStatus} via Tamara. Please try again.`,
              { reservationId: reservation.id, status: 'failed', gateway: 'tamara' }
            );
          }
          break;

        case 'pending':
        case 'processing':
          // Payment still processing - update status but don't change reservation status
          payment.transactionStatus = 'under_review';
          await this.paymentRepo.update(payment);
          console.log(`⏳ Payment ${orderId} is still processing for reservation ${reservationId}`);
          break;

        default:
          console.warn(`⚠️ Unknown order status from Tamara webhook: ${orderStatus}`);
          break;
      }

      // Update reservation in database
      await this.reservationRepo.update(reservation);

    } catch (error) {
      console.error('❌ Error processing Tamara webhook:', error);
      throw error;
    }
  }

  private async handleMimoWebhook(payload: any): Promise<void> {
    try {
      console.log('🔄 Processing Mimo webhook:', JSON.stringify(payload, null, 2));

      // Extract mimo payment data from webhook payload
      const paymentId = payload?.data?.id || payload?.id;
      const paymentStatus = payload?.data?.status || payload?.status;
      const reservationId = payload?.data?.metadata?.reservationId || payload?.metadata?.reservationId;

      if (!paymentId || !reservationId) {
        console.warn('⚠️ Missing paymentId or reservationId in Mimo webhook');
        return;
      }

      // Find the reservation
      const reservation = await this.reservationRepo.findById(reservationId);
      if (!reservation) {
        console.warn(`⚠️ Reservation not found for ID: ${reservationId}`);
        return;
      }

      // Find the payment record
      const payments = await this.paymentRepo.findByReservationId(reservationId);
      const payment = payments.find(p => p.id === paymentId);

      if (!payment) {
        console.warn(`⚠️ Payment not found for reservation ${reservationId} and payment ${paymentId}`);
        return;
      }

      // Process based on payment status
      switch (paymentStatus?.toLowerCase()) {
        case 'paid':
        case 'completed':
        case 'success':
          // Payment successful - confirm the reservation
          reservation.confirmPayment(
            paymentId,
            'mimo',
            payment.amount,
            'AED' // Default currency for mimo
          );

          // Update all payments for this reservation to 'paid'
          await this.updateAllPaymentsForReservation(reservationId, 'paid');
          console.log(`✅ Reservation ${reservationId} confirmed via Mimo webhook`);

          // Send confirmation notification
          const customer = await this.customerService.findById(reservation.customerId!);
          if (customer?.authUserId) {
            await this.notificationService.sendReservationNotification(
              customer.authUserId,
              'Payment Confirmed',
              `Your payment for reservation ${reservation.reservationNumber} has been confirmed.`,
              { reservationId: reservation.id, status: 'confirmed' }
            );
          }
          break;

        case 'failed':
        case 'cancelled':
        case 'rejected':
          // Payment failed - mark reservation as failed
          reservation.markAsFailed();

          // Update all payments for this reservation to 'cancelled'
          await this.updateAllPaymentsForReservation(reservationId, 'cancelled');
          console.log(`❌ Payment failed for reservation ${reservationId} via Mimo webhook`);

          // Send failure notification
          const customerFailed = await this.customerService.findById(reservation.customerId!);
          if (customerFailed?.authUserId) {
            await this.notificationService.sendReservationNotification(
              customerFailed.authUserId,
              'Payment Failed',
              `Your payment for reservation ${reservation.reservationNumber} has failed. Please try again.`,
              { reservationId: reservation.id, status: 'failed' }
            );
          }
          break;

        case 'pending':
        case 'processing':
          // Payment still processing - update status but don't change reservation status
          payment.transactionStatus = 'under_review';
          await this.paymentRepo.update(payment);
          console.log(`⏳ Payment ${paymentId} is still processing for reservation ${reservationId}`);
          break;

        default:
          console.warn(`⚠️ Unknown payment status from Mimo webhook: ${paymentStatus}`);
          break;
      }

      // Update reservation in database
      await this.reservationRepo.update(reservation);

    } catch (error) {
      console.error('❌ Error processing Mimo webhook:', error);
      throw error;
    }
  }

  public async cancelReservation(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationRepo.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status === 'cancelled') {
      return reservation; // Already canceled
    }

    // Process refund if payment was made
    if (reservation.paymentStatus === 'paid' && reservation.paymentId && reservation.paymentGateway) {
      const refundResult = await this.processRefund(reservation);

      if (refundResult.success) {
        // Update payment status to refunded
        const payment = await this.paymentRepo.findById(reservation.paymentId);
        if (payment) {
          payment.transactionStatus = 'refunded';
          await this.paymentRepo.update(payment);
        }
      } else {
        console.error('Refund failed:', refundResult.error);
        throw new Error(`Refund failed: ${refundResult.error}`);
      }
    }

    // Update reservation status
    reservation.cancel();
    await this.reservationRepo.update(reservation);

    return reservation;
  }

  private async processRefund(reservation: Reservation): Promise<{success: boolean, error?: string}> {
    try {
      switch (reservation.paymentGateway) {
        case 'stripe':
          return await this.processStripeRefund(reservation);
        case 'tamara':
          return await this.processTamaraRefund(reservation);
        case 'mimo':
          return await this.processMimoRefund(reservation);
        default:
          return {success: false, error: `Unsupported payment gateway: ${reservation.paymentGateway}`};
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Refund processing failed:', errorMessage);
      return {success: false, error: errorMessage};
    }
  }

  private async processStripeRefund(reservation: Reservation): Promise<{success: boolean, error?: string}> {
    try {
      // In a real implementation, this would call the Stripe API to process refund
      // For now, we'll simulate a successful refund
      console.log(`Processing Stripe refund for payment ${reservation.paymentId}, amount: ${reservation.amount}`);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {success: true};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Stripe refund failed';
      console.error('Stripe refund failed:', errorMessage);
      return {success: false, error: errorMessage};
    }
  }

  private async processTamaraRefund(reservation: Reservation): Promise<{success: boolean, error?: string}> {
    try {
      // In a real implementation, this would call the Tamara API to process refund
      // For now, we'll simulate a successful refund
      console.log(`Processing Tamara refund for payment ${reservation.paymentId}, amount: ${reservation.amount}`);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {success: true};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Tamara refund failed';
      console.error('Tamara refund failed:', errorMessage);
      return {success: false, error: errorMessage};
    }
  }

  private async processMimoRefund(reservation: Reservation): Promise<{success: boolean, error?: string}> {
    try {
      // In a real implementation, this would call the Mimo API to process refund
      // For now, we'll simulate a successful refund
      console.log(`Processing Mimo refund for payment ${reservation.paymentId}, amount: ${reservation.amount}`);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {success: true};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Mimo refund failed';
      console.error('Mimo refund failed:', errorMessage);
      return {success: false, error: errorMessage};
    }
  }

  public async handleRefundWebhook(
    gateway: PaymentGateway,
    payload: any
  ): Promise<void> {
    try {
      console.log(`🔄 Processing ${gateway} refund webhook:`, JSON.stringify(payload, null, 2));

      // Route to the appropriate refund webhook handler
      switch (gateway) {
        case 'stripe':
          await this.handleStripeRefundWebhook(payload);
          break;
        case 'tamara':
          await this.handleTamaraRefundWebhook(payload);
          break;
        case 'mimo':
          await this.handleMimoRefundWebhook(payload);
          break;
        default:
          console.warn(`Unsupported payment gateway for refund webhook: ${gateway}`);
      }
    } catch (error) {
      console.error(`Error processing ${gateway} refund webhook:`, error);
      throw error;
    }
  }

  private async handleStripeRefundWebhook(payload: any): Promise<void> {
    try {
      // Extract refund information from Stripe webhook
      const refundId = payload?.data?.object?.id;
      const paymentIntentId = payload?.data?.object?.payment_intent;
      const refundStatus = payload?.data?.object?.status;

      if (!refundId || !paymentIntentId) {
        console.warn('⚠️ Missing refundId or paymentIntentId in Stripe refund webhook');
        return;
      }

      // Find payment by processNumber (payment_intent ID)
      const payment = await this.paymentRepo.findByProcessNumber(paymentIntentId);
      if (!payment) {
        console.warn(`⚠️ Payment not found for paymentIntentId: ${paymentIntentId}`);
        return;
      }

      // Update payment status based on refund status
      switch (refundStatus?.toLowerCase()) {
        case 'succeeded':
          payment.transactionStatus = 'refunded';
          await this.paymentRepo.update(payment);
          console.log(`✅ Refund succeeded for payment ${payment.id} via Stripe webhook`);
          break;

        case 'failed':
        case 'cancelled':
          payment.transactionStatus = 'failed';
          await this.paymentRepo.update(payment);
          console.log(`❌ Refund failed for payment ${payment.id} via Stripe webhook`);
          break;

        default:
          console.log(`ℹ️ Unhandled refund status from Stripe: ${refundStatus}`);
          break;
      }
    } catch (error) {
      console.error('❌ Error processing Stripe refund webhook:', error);
      throw error;
    }
  }

  private async handleTamaraRefundWebhook(payload: any): Promise<void> {
    try {
      // Extract refund information from Tamara webhook
      const refundId = payload?.refund_id || payload?.id;
      const orderId = payload?.order_id || payload?.order_reference_id;
      const refundStatus = payload?.status || payload?.refund_status;

      if (!refundId || !orderId) {
        console.warn('⚠️ Missing refundId or orderId in Tamara refund webhook');
        return;
      }

      // Find reservation by order reference (assuming order_reference_id contains reservation ID or payment processNumber)
      // First try to find by processNumber
      let payments = await this.paymentRepo.findByProcessNumber(orderId);

      if (!payments) {
        console.warn(`⚠️ No payments found for orderId: ${orderId}`);
        return;
      }

      // Update payment status based on refund status
      switch (refundStatus?.toLowerCase()) {
        case 'completed':
        case 'approved':
          payments.transactionStatus = 'refunded';
          await this.paymentRepo.update(payments);
          console.log(`✅ Refund succeeded for payments related to order ${orderId} via Tamara webhook`);
          break;

        case 'failed':
        case 'declined':
        case 'cancelled':
          payments.transactionStatus = 'failed';
          await this.paymentRepo.update(payments);
          console.log(`❌ Refund failed for payments related to order ${orderId} via Tamara webhook`);
          break;

        default:
          console.log(`ℹ️ Unhandled refund status from Tamara: ${refundStatus}`);
          break;
      }
    } catch (error) {
      console.error('❌ Error processing Tamara refund webhook:', error);
      throw error;
    }
  }

  private async handleMimoRefundWebhook(payload: any): Promise<void> {
    try {
      // Extract refund information from Mimo webhook
      const refundId = payload?.data?.id || payload?.id;
      const paymentId = payload?.data?.payment_id || payload?.payment_id;
      const refundStatus = payload?.data?.status || payload?.status;

      if (!refundId || !paymentId) {
        console.warn('⚠️ Missing refundId or paymentId in Mimo refund webhook');
        return;
      }

      // Find payment by ID
      const payment = await this.paymentRepo.findById(paymentId);
      if (!payment) {
        console.warn(`⚠️ Payment not found for paymentId: ${paymentId}`);
        return;
      }

      // Update payment status based on refund status
      switch (refundStatus?.toLowerCase()) {
        case 'completed':
        case 'success':
          payment.transactionStatus = 'refunded';
          await this.paymentRepo.update(payment);
          console.log(`✅ Refund succeeded for payment ${paymentId} via Mimo webhook`);
          break;

        case 'failed':
        case 'cancelled':
        case 'rejected':
          payment.transactionStatus = 'failed';
          await this.paymentRepo.update(payment);
          console.log(`❌ Refund failed for payment ${paymentId} via Mimo webhook`);
          break;

        default:
          console.log(`ℹ️ Unhandled refund status from Mimo: ${refundStatus}`);
          break;
      }
    } catch (error) {
      console.error('❌ Error processing Mimo refund webhook:', error);
      throw error;
    }
  }
}

export default ReservationPaymentService;
