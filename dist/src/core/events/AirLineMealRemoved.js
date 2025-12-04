"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirLineMealRemoved = void 0;
class AirLineMealRemoved {
    constructor(airLineId, mealId) {
        this.airLineId = airLineId;
        this.mealId = mealId;
        this.type = "AirLineMealRemoved";
        this.occurredOn = new Date();
    }
}
exports.AirLineMealRemoved = AirLineMealRemoved;
