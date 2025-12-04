"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trip = void 0;
class Trip {
    constructor(id, clientId, status, name, departure, arrival, tripDuration, includesHotel, includesFlight, rating = 0, description = '', includeProgram = [], noIncludeProgram = [], price = 0, days = 1, departureDate = new Date(), returnDate = new Date(), schedule = [], images = [], hotels = [], flights = [], ratings = [], createdAt, updatedAt) {
        this.id = id;
        this.clientId = clientId;
        this.status = status;
        this.name = name;
        this.departure = departure;
        this.arrival = arrival;
        this.tripDuration = tripDuration;
        this.includesHotel = includesHotel;
        this.includesFlight = includesFlight;
        this.rating = rating;
        this.description = description;
        this.includeProgram = includeProgram;
        this.noIncludeProgram = noIncludeProgram;
        this.price = price;
        this.days = days;
        this.departureDate = departureDate;
        this.returnDate = returnDate;
        this.schedule = schedule;
        this.images = images;
        this.hotels = hotels;
        this.flights = flights;
        this.ratings = ratings;
        const now = new Date();
        this.createdAt = createdAt || now;
        this.updatedAt = updatedAt || now;
    }
}
exports.Trip = Trip;
