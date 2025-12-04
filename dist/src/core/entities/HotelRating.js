"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelRating = void 0;
class HotelRating {
    constructor(id, hotelId, name, comment = '', rating, images = [], createdAt, updatedAt) {
        this.id = id;
        this.hotelId = hotelId;
        this.name = name;
        this.comment = comment;
        this.rating = rating;
        this.images = images;
        const now = new Date();
        this.createdAt = createdAt || now;
        this.updatedAt = updatedAt || now;
    }
}
exports.HotelRating = HotelRating;
