"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelImageRemoved = void 0;
const DomainEvent_1 = require("./DomainEvent");
class HotelImageRemoved extends DomainEvent_1.DomainEvent {
    constructor(hotelId, imageId) {
        super();
        this.hotelId = hotelId;
        this.imageId = imageId;
        this.type = "HotelImageRemoved";
    }
}
exports.HotelImageRemoved = HotelImageRemoved;
