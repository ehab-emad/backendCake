"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitFlight = void 0;
class TransitFlight {
    constructor(id, flightId, departureCity, arrivalCity, departureIata, arrivalIata, departureTime, arrivalTime, duration, status = true, airlineId, clientId, name, seats, rating, flightNumber, 
    // public airline?: string,
    price = 0, currency = "AED", numberOfStops = 0, availableSeats = 0, aircraftType, aircraftImage, seatLayout, seatPitch, createdAt, updatedAt) {
        this.id = id;
        this.flightId = flightId;
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;
        this.departureIata = departureIata;
        this.arrivalIata = arrivalIata;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.duration = duration;
        this.status = status;
        this.airlineId = airlineId;
        this.clientId = clientId;
        this.name = name;
        this.seats = seats;
        this.rating = rating;
        this.flightNumber = flightNumber;
        this.price = price;
        this.currency = currency;
        this.numberOfStops = numberOfStops;
        this.availableSeats = availableSeats;
        this.aircraftType = aircraftType;
        this.aircraftImage = aircraftImage;
        this.seatLayout = seatLayout;
        this.seatPitch = seatPitch;
        const now = new Date();
        this.createdAt = createdAt || now;
        this.updatedAt = updatedAt || now;
    }
}
exports.TransitFlight = TransitFlight;
