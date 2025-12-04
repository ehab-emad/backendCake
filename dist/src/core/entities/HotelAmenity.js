"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelAmenityRemoved = exports.HotelAmenityAdded = exports.HotelAmenity = void 0;
const AggregateRoot_1 = require("./AggregateRoot");
class HotelAmenity extends AggregateRoot_1.AggregateRoot {
    constructor(id, hotelId, name) {
        super();
        this.id = id;
        this.hotelId = hotelId;
        this.name = name;
    }
    markAdded() {
        this.apply(new HotelAmenityAdded(this.id, this.hotelId, this.name));
    }
    markRemoved() {
        this.apply(new HotelAmenityRemoved(this.id, this.hotelId));
    }
}
exports.HotelAmenity = HotelAmenity;
class HotelAmenityAdded {
    constructor(amenityId, hotelId, name) {
        this.amenityId = amenityId;
        this.hotelId = hotelId;
        this.name = name;
        this.occurredOn = new Date();
    }
}
exports.HotelAmenityAdded = HotelAmenityAdded;
class HotelAmenityRemoved {
    constructor(amenityId, hotelId) {
        this.amenityId = amenityId;
        this.hotelId = hotelId;
        this.occurredOn = new Date();
    }
}
exports.HotelAmenityRemoved = HotelAmenityRemoved;
