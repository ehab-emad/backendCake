import { PaymentStatus, PaymentGateway } from '../types/payment.types';
import { Payment } from './Payment';
import { ExtraService } from '../types/extraService.types';

// Using 'cancelled' (with two 'l's) to match the database schema and DTOs
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'failed';

export class Reservation {
  public id: string;
  public reservationNumber: string;
  public status: ReservationStatus;
  public paymentStatus: PaymentStatus;
  public paymentId: string | null = null;
  public paymentGateway: PaymentGateway | null = null;
  public amount: number | null = null;
  public currency: string | null = null;
  public clientId: string;
  public customerId: string;
  public roomId: string | null;
  public flightId: string | null;
  public tripId: string | null;
  public fromDate: string | null;
  public toDate: string | null;
  public adult: number | null;
  public children: number | null;
  public infant: number | null;
  public rooms: number | null;
  public price: number | null;
  public seats: string[] = []; // Legacy field, use specific seat types below
  public mainFlightSeats: string[] = []; // Main flight seats
  public returnFlightSeats: string[] = []; // Return flight seats
  public transitFlightSeats: string[] = []; // Transit flight seats by flight ID
  public baggage: string | null;
  public meals: ExtraService | null;
  public extraBaggage: ExtraService | null;
  public airportTransfer: ExtraService | null;
  public unlimitedInternet: ExtraService | null;
  public extras?: any;
  public name?: string | null;
  public email?: string | null;
  public gender?: string | null;
  public latitude?: number | null;
  public longitude?: number | null;
  public nationality?: string | null;
  public passportNumber?: string | null;
  public passportExpiry?: string | null;
  public phoneNumber?: string | null;
  public dateOfBirth: string | null;
  public departureDate: string | null;
  public returnDate: string | null;
  public updatedAt: Date | null;
  public payment: Payment | null = null;

  constructor(
    id: string,
    reservationNumber: string,
    status: ReservationStatus,
    paymentStatus: PaymentStatus,
    clientId: string,
    customerId: string,
    roomId: string | null,
    flightId: string | null,
    tripId: string | null,
    fromDate: string | null,
    toDate: string | null,
    adult: number | null,
    children: number | null,
    infant: number | null,
    rooms: number | null,
    price: number | null,
    seats: string[] | null,
    mainFlightSeats: string[] | null, // كراسي الرحلة الأساسية
    transitFlightSeats: string[] | null, // كراسي الرحلات الترانزيت
    returnFlightSeats: string[] | null, // كراسي رحلات العودة
    baggage: string | null,
    meals: ExtraService | null,
    extraBaggage: ExtraService | null,
    airportTransfer: ExtraService | null,
    unlimitedInternet: ExtraService | null,
    extras?: any,
    name?: string | null,
    email?: string | null,
    gender?: string | null,
    latitude?: number | null,
    longitude?: number | null,
    nationality?: string | null,
    passportNumber?: string | null,
    passportExpiry?: string | null,
    phoneNumber?: string | null,
    dateOfBirth?: string | null,
    departureDate?: string | null,
    returnDate?: string | null
  ) {
    this.id = id;
    this.reservationNumber = reservationNumber;
    this.status = status;
    this.paymentStatus = paymentStatus || 'pending';
    this.clientId = clientId;
    this.customerId = customerId;
    this.roomId = roomId;
    this.flightId = flightId;
    this.tripId = tripId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.adult = adult;
    this.children = children;
    this.infant = infant || 0;
    this.rooms = rooms || 1;
    this.price = price || 0;
    this.seats = seats || [];
    this.mainFlightSeats = mainFlightSeats || []; // تهيئة كراسي الرحلة الأساسية
    this.transitFlightSeats = transitFlightSeats || []; // تهيئة كراسي الرحلات الترانزيت
    this.returnFlightSeats = returnFlightSeats || []; // تهيئة كراسي رحلات العودة
    this.baggage = baggage;
    this.meals = meals;
    this.extraBaggage = extraBaggage;
    this.airportTransfer = airportTransfer;
    this.unlimitedInternet = unlimitedInternet;
    this.extras = extras;
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.latitude = latitude;
    this.longitude = longitude;
    this.nationality = nationality;
    this.passportNumber = passportNumber;
    this.passportExpiry = passportExpiry;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth || null;
    this.departureDate = departureDate || null;
    this.returnDate = returnDate || null;
    this.updatedAt = new Date();
  }

  public confirmPayment(paymentId: string, gateway: PaymentGateway, amount: number, currency: string = 'USD'): void {
    this.paymentId = paymentId;
    this.paymentGateway = gateway;
    this.paymentStatus = 'paid';
    this.status = 'confirmed';
    this.amount = amount;
    this.currency = currency;
    this.updatedAt = new Date();
  }

  public cancel(): void {
    if (this.status === 'confirmed' && this.paymentStatus === 'paid') {
      this.paymentStatus = 'refunded';
      // The actual refund will be processed by the payment gateway service
    }
    this.status = 'cancelled';
    this.updatedAt = new Date();
  }

  // Mark reservation as failed when payment fails
  public markAsFailed(): void {
    this.status = 'failed';
    this.paymentStatus = 'failed';
    this.updatedAt = new Date();
  }
}
