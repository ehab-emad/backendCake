"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelImage = void 0;
const hotelimageAdded_1 = require("../events/hotelimageAdded");
const HotelImageRemoved_1 = require("../events/HotelImageRemoved");
const AggregateRoot_1 = require("./AggregateRoot");
class HotelImage extends AggregateRoot_1.AggregateRoot {
    constructor(id, hotelId, path) {
        super();
        this.id = id;
        this.hotelId = hotelId;
        this.path = path;
    }
    markAdded() {
        this.apply(new hotelimageAdded_1.HotelImageAdded(this.hotelId, this.id));
    }
    markRemoved() {
        this.apply(new HotelImageRemoved_1.HotelImageRemoved(this.hotelId, this.id));
    }
}
exports.HotelImage = HotelImage;
