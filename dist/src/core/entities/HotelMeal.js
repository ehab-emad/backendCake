"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelMealRemoved = exports.HotelMealAdded = exports.HotelMeal = void 0;
const AggregateRoot_1 = require("./AggregateRoot");
class HotelMeal extends AggregateRoot_1.AggregateRoot {
    constructor(id, hotelId, name) {
        super();
        this.id = id;
        this.hotelId = hotelId;
        this.name = name;
    }
    markAdded() {
        this.apply(new HotelMealAdded(this.id, this.hotelId, this.name));
    }
    markRemoved() {
        this.apply(new HotelMealRemoved(this.id, this.hotelId));
    }
}
exports.HotelMeal = HotelMeal;
class HotelMealAdded {
    constructor(mealId, hotelId, name) {
        this.mealId = mealId;
        this.hotelId = hotelId;
        this.name = name;
        this.occurredOn = new Date();
    }
}
exports.HotelMealAdded = HotelMealAdded;
class HotelMealRemoved {
    constructor(mealId, hotelId) {
        this.mealId = mealId;
        this.hotelId = hotelId;
        this.occurredOn = new Date();
    }
}
exports.HotelMealRemoved = HotelMealRemoved;
