"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealRemoved = exports.MealAdded = exports.AirLineMeal = void 0;
const AggregateRoot_1 = require("./AggregateRoot");
class AirLineMeal extends AggregateRoot_1.AggregateRoot {
    constructor(id, airLineId, name) {
        super();
        this.id = id;
        this.airLineId = airLineId;
        this.name = name;
    }
    markAdded() {
        this.apply(new MealAdded(this.id, this.airLineId, this.name));
    }
    markRemoved() {
        this.apply(new MealRemoved(this.id, this.airLineId));
    }
}
exports.AirLineMeal = AirLineMeal;
class MealAdded {
    constructor(mealId, airLineId, name) {
        this.mealId = mealId;
        this.airLineId = airLineId;
        this.name = name;
        this.occurredOn = new Date();
    }
}
exports.MealAdded = MealAdded;
class MealRemoved {
    constructor(mealId, airLineId) {
        this.mealId = mealId;
        this.airLineId = airLineId;
        this.occurredOn = new Date();
    }
}
exports.MealRemoved = MealRemoved;
