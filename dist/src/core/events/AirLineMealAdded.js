"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirLineMealAdded = void 0;
class AirLineMealAdded {
    constructor(airLineId, mealId) {
        this.airLineId = airLineId;
        this.mealId = mealId;
        this.type = "AirLineMealAdded";
        this.occurredOn = new Date();
    }
}
exports.AirLineMealAdded = AirLineMealAdded;
