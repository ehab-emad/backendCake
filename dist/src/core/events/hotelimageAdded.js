"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelImageAdded = void 0;
const DomainEvent_1 = require("./DomainEvent");
class HotelImageAdded extends DomainEvent_1.DomainEvent {
    constructor(hotelId, imageId) {
        super();
        this.hotelId = hotelId;
        this.imageId = imageId;
        this.type = "HotelImageAdded";
    }
}
exports.HotelImageAdded = HotelImageAdded;
