import { injectable, inject } from "inversify";
import { v4 as uuid } from "uuid";

import { CreateReservationDTO } from "../dto/CreateReservation.dto";
import { UpdateReservationDTO } from "../dto/UpdateReservation.dto";
import { FilterReservationDTO } from "../dto/FilterReservation.dto";

import { IReservationRepository } from "../../core/interfaces/repositories/IReservationRepository";
import { IPaymentRepository } from "../../core/interfaces/repositories/IPaymentRepository";
import { IReservationService } from "../../core/interfaces/services/IReservationService";
import { Reservation } from "../../core/entities/Reservation";
import { Payment } from "../../core/entities/Payment";
import { PaymentGateway, PaymentStatus, PaymentDetails } from "../../core/types/payment.types";
import { ReservationStatus } from '../../core/entities/Reservation';

import { ClientService } from "./ClientService";
import { CustomerService } from "./CustomerService";
// import { RoomService } from "./RoomService";
// import { FlightService } from "./FlightService";
// import { TripService } from "./TripService";
import { NotificationService } from "./NotificationService";
import { PaymentService } from "./PaymentService";
import { ReservationPaymentService } from "./ReservationPaymentService";

import { TYPES } from "../../shared/di/types";

@injectable()
export class ReservationService implements IReservationService {
  constructor(
    @inject(TYPES.ReservationRepository)
    private readonly repo: IReservationRepository,
    
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepo: IPaymentRepository,
    
    @inject(TYPES.PaymentService)
    private readonly paymentService: PaymentService,
    
    @inject(TYPES.ReservationPaymentService)
    private readonly reservationPaymentService: ReservationPaymentService,

    @inject(TYPES.ClientService)
    private readonly clientService: ClientService,

    @inject(TYPES.CustomerService)
    private readonly customerService: CustomerService,

    // @inject(TYPES.RoomService)
    // private readonly roomService: RoomService,

    // @inject(TYPES.FlightService)
    // private readonly flightService: FlightService,

    // @inject(TYPES.TripService)
    // private readonly tripService: TripService,

    @inject(TYPES.NotificationService)
    private readonly notificationService: NotificationService
  ) {}

  public async createReservationOnly(dto: CreateReservationDTO): Promise<Reservation> {
    // Extract seat arrays
    const seatNumbers = dto.seat
      ? (Array.isArray(dto.seat) ? dto.seat : [dto.seat])
      : [];

    const id = uuid();

    const reservation = new Reservation(
      id,
      `RES-${Date.now()}`,
      'pending', // status
      'pending', // paymentStatus
      dto.clientId,
      dto.customerId,
      null, // roomId is no longer supported
      null, // flightId is no longer supported
      null, // tripId is no longer supported
      dto.fromDate || null,
      dto.toDate || null,
      dto.adult || null,
      dto.children || null,
      dto.infant || 0,
      dto.rooms || 1,
      dto.price || 0,
      seatNumbers, 
      [], // mainFlightSeats is no longer supported
      [], // transitFlightSeats is no longer supported
      [], // returnFlightSeats is no longer supported
      dto.baggage || null,
      dto.meals && dto.meals.length > 0 ? dto.meals[0] : null,
      dto.extraBaggage && dto.extraBaggage.length > 0 ? dto.extraBaggage[0] : null,
      dto.airportTransfer && dto.airportTransfer.length > 0 ? dto.airportTransfer[0] : null,
      dto.unlimitedInternet && dto.unlimitedInternet.length > 0 ? dto.unlimitedInternet[0] : null,
      dto.extras,
      dto.name,
      dto.email,
      dto.gender,
      dto.latitude,
      dto.longitude,
      dto.nationality,
      dto.passportNumber,
      dto.passportExpiry,
      dto.phoneNumber,
      dto.dateOfBirth || null,
      dto.departureDate,
      dto.returnDate
    );

    // Save the reservation
    await this.repo.create(reservation);

    // Send notification to customer
    const customer = await this.customerService.findById(dto.customerId);
    if (customer?.authUserId) {
      await this.notificationService.sendReservationNotification(
        customer.authUserId,
        'Reservation Created - Payment Pending',
        `Your reservation ${reservation.reservationNumber} has been created. Please complete the payment to confirm.`,
        { reservationId: reservation.id }
      );
    }

    return reservation;
  }

  /**
   * Marks seats as booked for main, transit, and return flights
   */
  private async markSeatsAsBooked(
    flightId: string,
    mainFlightSeats: string[],
    transitFlightSeats:  string[],
    returnFlightSeats: string[]
  ): Promise<void> {
    // Mark main flight seats as booked
    if (mainFlightSeats.length > 0) {
      // await this.flightService.updateSeatsStatus(flightId, mainFlightSeats, true);
    }

    // Mark transit flight seats as booked
    if (transitFlightSeats.length > 0) {
      // await this.flightService.updateTransitSeatsStatus(flightId, transitFlightSeats, true);
    }

    // Mark return flight seats as booked
    if (returnFlightSeats.length > 0) {
      // await this.flightService.updateReturnSeatsStatus(flightId, returnFlightSeats, true);
    }
   
  }

  public async create(dto: CreateReservationDTO, paymentMethod: PaymentGateway): Promise<{reservation: Reservation, paymentUrl: string}> {
    // Extract seat arrays
    const seatNumbers = dto.seat
      ? (Array.isArray(dto.seat) ? dto.seat : [dto.seat])
      : [];

    const id = uuid();

    const reservation = new Reservation(
      id,
      `RES-${Date.now()}`,
      'pending', // status
      'pending', // paymentStatus
      dto.clientId,
      dto.customerId,
      null, // roomId is no longer supported
      null, // flightId is no longer supported
      null, // tripId is no longer supported
      dto.fromDate || null,
      dto.toDate || null,
      dto.adult || null,
      dto.children || null,
      dto.infant || 0,
      dto.rooms || 1,
      dto.price || 0,
      seatNumbers,
      [], // mainFlightSeats
      [], // transitFlightSeats
      [], // returnFlightSeats
      dto.baggage || null,
      dto.meals && dto.meals.length > 0 ? dto.meals[0] : null,
      dto.extraBaggage && dto.extraBaggage.length > 0 ? dto.extraBaggage[0] : null,
      dto.airportTransfer && dto.airportTransfer.length > 0 ? dto.airportTransfer[0] : null,
      dto.unlimitedInternet && dto.unlimitedInternet.length > 0 ? dto.unlimitedInternet[0] : null,
      dto.extras,
      dto.name,
      dto.email,
      dto.gender,
      dto.latitude,
      dto.longitude,
      dto.nationality,
      dto.passportNumber,
      dto.passportExpiry,
      dto.phoneNumber,
      dto.dateOfBirth || null,
      dto.departureDate,
      dto.returnDate
    );

    // Calculate the total amount for the reservation
    const amount = await this.calculateReservationAmount(dto);
    
    // Save the reservation first
    await this.repo.create(reservation);

    try {
      // Process payment using the reservation payment service
      const paymentDetails: PaymentDetails = {
        amount,
        currency: 'AED',
        customerEmail: dto.email || '',
        description: `Reservation #${reservation.reservationNumber}`,
        metadata: {
          reservationId: reservation.id,
          reservationNumber: reservation.reservationNumber,
          serviceType: dto.serviceType,
          serviceId: dto.serviceId
        },
        successUrl: `${process.env.FRONTEND_URL}/reservations/${reservation.id}/success`,
        cancelUrl: `${process.env.FRONTEND_URL}/reservations/${reservation.id}/cancel`
      };

      const paymentResult = await this.reservationPaymentService.processPayment(
        reservation.id,
        paymentMethod,
        paymentDetails
      );

      // Update reservation status based on payment result
      if (paymentResult.success) {
        // If payment was processed immediately (e.g., card payment)
        reservation.confirmPayment(
          paymentResult.paymentId || '',
          paymentMethod,
          paymentResult.amount || 0,
          paymentResult.currency || 'USD'
        );

        // No flight seat booking logic needed anymore
      } else if (paymentResult.redirectUrl) {
        // If payment requires redirection (e.g., 3D Secure, bank redirect)
        reservation.status = 'pending';
        reservation.paymentStatus = 'pending' as PaymentStatus;
      } else {
        // Handle other cases
        reservation.markAsFailed();
      }

      // Update the reservation with the new status
      await this.repo.update(reservation);

      // Send notification to customer
      const customer = await this.customerService.findById(dto.customerId);
      if (customer?.authUserId) {
        await this.notificationService.sendReservationNotification(
          customer.authUserId,
          'Reservation Created - Payment Pending',
          `Your reservation ${reservation.reservationNumber} has been created. Please complete the payment to confirm.`,
          { reservationId: reservation.id }
        );
      }

      return { 
        reservation,
        paymentUrl: paymentResult.redirectUrl || `${process.env.FRONTEND_URL}/reservations/${reservation.id}`
      };
    } catch (error) {
      // Log the error but keep the status as pending
      console.error('Error processing payment for reservation:', error);
      
      // Update the reservation with pending status
      reservation.status = 'pending';
      reservation.paymentStatus = 'pending';
      await this.repo.update(reservation);
      
      // Return the reservation with pending status
      return { 
        reservation,
        paymentUrl: `${process.env.FRONTEND_URL}/reservations/${reservation.id}`
      };
    }
  }

  public async listReservations(filters: FilterReservationDTO) {
    const [data, total] = await this.repo.findAndCount(filters);

    const enriched = await Promise.all(
      data.map(async (r) => {
        const [client, customer, payments] = await Promise.all([
          this.clientService.getClient(r.clientId),
          this.customerService.findById(r.customerId),
          this.paymentRepo.findByReservationId(r.id)
        ]);
        
        const payment = payments.length > 0 ? payments[0] : null;

        const { seats, ...reservationWithoutSeats } = r as any; // No longer fetching room, flight, trip data directly
        
        return {
          ...reservationWithoutSeats,
          client,
          customer,
          room: null, // Room service is not supported
          flight: null, // Flight service is not supported
          trip: null, // Trip service is not supported
        };
      })
    );

    return {
      data: enriched,
      total,
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
    };
  }

  public async get(id: string): Promise<Reservation & { payment?: Payment }> {
    const r = await this.repo.findById(id);
    if (!r) throw new Error("Reservation not found");
    
    // Get the latest payment for this reservation
    const payments = await this.paymentRepo.findByReservationId(id);
    
    // Create a new Reservation instance
    const reservation = new Reservation(
      r.id,
      r.reservationNumber,
      r.status,
      r.paymentStatus,
      r.clientId,
      r.customerId,
      null, // roomId is no longer supported
      null, // flightId is no longer supported
      null, // tripId is no longer supported
      r.fromDate,
      r.toDate,
      r.adult,

      r.children,
      r.infant,
      r.rooms,
      r.price,

      r.seats,
      r.mainFlightSeats,
      r.transitFlightSeats,
      r.returnFlightSeats,
      r.baggage,
      r.meals,
      r.extraBaggage,
      r.airportTransfer,
      r.unlimitedInternet,
      r.extras,
      r.name,
      r.email,
      r.gender,
      r.latitude,
      r.longitude,
      r.nationality,
      r.passportNumber,
      r.passportExpiry,
      r.phoneNumber,

      r.dateOfBirth,
      r.departureDate,
      r.returnDate
    );
    
    // Set the payment if it exists
    if (payments.length > 0) {
      (reservation as any).payment = payments[0];
    }
    
    return reservation as Reservation & { payment?: Payment };
  }

  public async update(id: string, dto: UpdateReservationDTO): Promise<Reservation> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error('Reservation not found');
    }

    // Ensure the status is a valid ReservationStatus
    const status = (dto.status as ReservationStatus) || existing.status;
    
    const updated = new Reservation(
      existing.id,
      dto.reservationNumber || existing.reservationNumber,
      status,
      'pending' as PaymentStatus, // paymentStatus - will be updated based on payment
      dto.clientId || existing.clientId,
      dto.customerId || existing.customerId,
      null, // roomId is no longer supported
      null, // flightId is no longer supported
      null, // tripId is no longer supported
      dto.fromDate || existing.fromDate,
      dto.toDate || existing.toDate,
      dto.adult !== undefined ? dto.adult : existing.adult,
      dto.children !== undefined ? dto.children : existing.children,
      dto.infant !== undefined ? dto.infant : existing.infant,
      dto.rooms !== undefined ? dto.rooms : existing.rooms,
      dto.price !== undefined ? dto.price : existing.price,
      dto.seat !== undefined
        ? Array.isArray(dto.seat)
          ? dto.seat
          : [dto.seat].filter(Boolean)
        : existing.seats,
      dto.mainFlightSeats !== undefined
        ? Array.isArray(dto.mainFlightSeats)
          ? dto.mainFlightSeats
          : [dto.mainFlightSeats].filter(Boolean)
        : existing.mainFlightSeats,
      dto.transitFlightSeats !== undefined
        ? Array.isArray(dto.transitFlightSeats)
          ? dto.transitFlightSeats
          : [dto.transitFlightSeats].filter(Boolean)
        : existing.transitFlightSeats,
      dto.returnFlightSeats !== undefined
        ? Array.isArray(dto.returnFlightSeats)
          ? dto.returnFlightSeats
          : [dto.returnFlightSeats].filter(Boolean)
        : existing.returnFlightSeats,
      dto.baggage !== undefined ? dto.baggage : existing.baggage,
        dto.meals !== undefined ? (Array.isArray(dto.meals) && dto.meals.length > 0 ? dto.meals[0] : null) : existing.meals,
      dto.extraBaggage !== undefined ? (Array.isArray(dto.extraBaggage) && dto.extraBaggage.length > 0 ? dto.extraBaggage[0] : null) : existing.extraBaggage,
      dto.airportTransfer !== undefined ? (Array.isArray(dto.airportTransfer) && dto.airportTransfer.length > 0 ? dto.airportTransfer[0] : null) : existing.airportTransfer,
      dto.unlimitedInternet !== undefined ? (Array.isArray(dto.unlimitedInternet) && dto.unlimitedInternet.length > 0 ? dto.unlimitedInternet[0] : null) : existing.unlimitedInternet,
      dto.extras ? (typeof dto.extras === 'string' ? JSON.parse(dto.extras) : dto.extras) : existing.extras,
      // Update customer details if provided
      dto.name !== undefined ? dto.name : existing.name,
      dto.email !== undefined ? dto.email : existing.email,
      dto.gender !== undefined ? dto.gender : existing.gender,
      dto.latitude !== undefined ? dto.latitude : existing.latitude,
      dto.longitude !== undefined ? dto.longitude : existing.longitude,
      dto.nationality !== undefined ? dto.nationality : existing.nationality,
      dto.passportNumber !== undefined ? dto.passportNumber : existing.passportNumber,
      dto.passportExpiry !== undefined ? dto.passportExpiry : existing.passportExpiry,
      dto.phoneNumber !== undefined ? dto.phoneNumber : existing.phoneNumber,
      dto.dateOfBirth !== undefined ? dto.dateOfBirth : existing.dateOfBirth,
      dto.departureDate !== undefined ? dto.departureDate : existing.departureDate,
      dto.returnDate !== undefined ? dto.returnDate : existing.returnDate
    );
    await this.repo.update(updated);
    return updated;
  }

  public async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  public async confirmPayment(paymentId: string): Promise<Reservation> {
    // Get the payment record
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment || !payment.reservationId) {
      throw new Error('Payment not found or not linked to a reservation');
    }
    
    // Update payment status
    payment.transactionStatus = 'paid';
    await this.paymentRepo.update(payment);
    
    // Update reservation status to confirmed
    const reservation = await this.repo.findById(payment.reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    reservation.status = 'confirmed';
    await this.repo.update(reservation);
    
    // Send confirmation notification
    const customer = await this.customerService.findById(reservation.customerId!);
    await this.notificationService.sendReservationNotification(
      customer.authUserId,
      "Reservation Confirmed",
      `Your reservation ${reservation.reservationNumber} has been confirmed. Thank you for your payment!`,
      { reservationId: reservation.id, status: reservation.status }
    );
    
    return reservation;
  }
  
  private async calculateReservationAmount(dto: CreateReservationDTO): Promise<number> {
    let baseAmount = 0;
    
    try {
      // Validate required fields
      if (!dto.serviceType || !dto.serviceId) {
        throw new Error('Service type and service ID are required');
      }

      // Calculate base amount based on service type
      if (dto.serviceType === 'room' && dto.serviceId) {
        // Room service is not supported
        throw new Error('Room service is not supported');
      } 
      else if (dto.serviceType === 'flight' && dto.serviceId) {
        // Flight service is not supported
        throw new Error('Flight service is not supported');
      } 
      else if (dto.serviceType === 'trip' && dto.serviceId) {
        // Trip service is not supported
        throw new Error('Trip service is not supported');
      }
      
      // No other service types are supported, so baseAmount remains 0 unless other logic is added.
      
      // Add any additional services
      if (dto.extraBaggage && Array.isArray(dto.extraBaggage)) {
        baseAmount += dto.extraBaggage.reduce((sum, item) => sum + (item?.totalPrice || 0), 0);
      }
      
      if (dto.airportTransfer && Array.isArray(dto.airportTransfer)) {
        baseAmount += dto.airportTransfer.reduce((sum, item) => sum + (item?.totalPrice || 0), 0);
      }
      
      if (dto.unlimitedInternet && Array.isArray(dto.unlimitedInternet)) {
        baseAmount += dto.unlimitedInternet.reduce((sum, item) => sum + (item?.totalPrice || 0), 0);
      }
      
      // Ensure we don't return negative amounts
      return Math.max(0, baseAmount);
      
    } catch (error: unknown) {
      console.error('Error calculating reservation amount:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to calculate reservation amount: ${errorMessage}`);
    }
  }
  
  public async cancel(id: string): Promise<Reservation> {
    // Get the existing reservation first to preserve its data
    const existing = await this.get(id);
    // Create a clean update object with only the necessary fields
    const updateData: any = {
      // Use the seats array directly
      seats: existing.seats || [],
      mainFlightSeats: [], // mainFlightSeats is no longer supported
      transitFlightSeats: [], // transitFlightSeats is no longer supported
      returnFlightSeats: [], // returnFlightSeats is no longer supported

      // Set status to cancelled
      status: "cancelled" as const
    };
    
    // Add optional fields if they exist in the existing reservation
    const optionalFields = [
      'clientId', 'customerId', 'serviceType', 'fromDate', 'toDate',
      'adult', 'children', 'infant', 'rooms', 'price', 'baggage',
      'meals', 'extraBaggage', 'airportTransfer', 'unlimitedInternet',
      'extras', 'name', 'email', 'gender', 'phoneNumber', 'nationality',
      'passportNumber', 'dateOfBirth', 'specialRequests', 'notes',
      'checkInTime', 'checkOutTime', // removed flightNumber, airline, departureAirport, arrivalAirport, departureTime, arrivalTime, tripType, returnDate, tripDuration, destination, accommodation, activities, inclusions, exclusions, cancellationPolicy, paymentTerms, termsAndConditions
    ];
    
    // Only include fields that exist in the existing reservation
    optionalFields.forEach(field => {
      if (field in existing) {
        updateData[field] = (existing as any)[field] || undefined;
      }
    });
    // Update the reservation
    const cancelled = await this.update(id, updateData);

    // Update any pending payments
    const payments = await this.paymentRepo.findByReservationId(id);
    for (const payment of payments) {
      if (payment.transactionStatus === 'under_review') {
        payment.transactionStatus = 'cancelled';
        await this.paymentRepo.update(payment);
      }
    }

    const customer = await this.customerService.findById(cancelled.customerId!);
    await this.notificationService.sendReservationNotification(
      customer.authUserId,
      "Reservation Cancelled",
      `Your reservation ${cancelled.reservationNumber} has been cancelled.`,
      { reservationId: cancelled.id, status: cancelled.status }
    );

    return cancelled;
  }
}
