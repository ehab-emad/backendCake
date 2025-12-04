"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightRating = void 0;
class FlightRating {
    constructor(id, flightId, name, comment = '', rating, images = [], createdAt, updatedAt) {
        this.id = id;
        this.flightId = flightId;
        this.name = name;
        this.comment = comment;
        this.rating = rating;
        this.images = images;
        const now = new Date();
        this.createdAt = createdAt || now;
        this.updatedAt = updatedAt || now;
    }
}
exports.FlightRating = FlightRating;
