"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
class Reservation {
    constructor(id, reservationNumber, status, paymentStatus, clientId, customerId, roomId, flightId, tripId, fromDate, toDate, adult, children, infant, rooms, price, seats, mainFlightSeats, // كراسي الرحلة الأساسية
    transitFlightSeats, // كراسي الرحلات الترانزيت
    returnFlightSeats, // كراسي رحلات العودة
    baggage, meals, extraBaggage, airportTransfer, unlimitedInternet, extras, name, email, gender, latitude, longitude, nationality, passportNumber, passportExpiry, phoneNumber, dateOfBirth, departureDate, returnDate) {
        this.paymentId = null;
        this.paymentGateway = null;
        this.amount = null;
        this.currency = null;
        this.seats = []; // Legacy field, use specific seat types below
        this.mainFlightSeats = []; // Main flight seats
        this.returnFlightSeats = []; // Return flight seats
        this.transitFlightSeats = []; // Transit flight seats by flight ID
        this.payment = null;
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
    confirmPayment(paymentId, gateway, amount, currency = 'USD') {
        this.paymentId = paymentId;
        this.paymentGateway = gateway;
        this.paymentStatus = 'paid';
        this.status = 'confirmed';
        this.amount = amount;
        this.currency = currency;
        this.updatedAt = new Date();
    }
    cancel() {
        if (this.status === 'confirmed' && this.paymentStatus === 'paid') {
            this.paymentStatus = 'refunded';
            // The actual refund will be processed by the payment gateway service
        }
        this.status = 'cancelled';
        this.updatedAt = new Date();
    }
    // Mark reservation as failed when payment fails
    markAsFailed() {
        this.status = 'failed';
        this.paymentStatus = 'failed';
        this.updatedAt = new Date();
    }
}
exports.Reservation = Reservation;
