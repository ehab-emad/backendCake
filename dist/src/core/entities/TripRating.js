"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripRating = void 0;
class TripRating {
    constructor(id, tripId, name, comment = '', rating, images = [], createdAt, updatedAt) {
        this.id = id;
        this.tripId = tripId;
        this.name = name;
        this.comment = comment;
        this.rating = rating;
        this.images = images;
        const now = new Date();
        this.createdAt = createdAt || now;
        this.updatedAt = updatedAt || now;
    }
}
exports.TripRating = TripRating;
