"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirLineFeatureAdded = void 0;
class AirLineFeatureAdded {
    constructor(airLineId, featureId) {
        this.airLineId = airLineId;
        this.featureId = featureId;
        this.type = "AirLineFeatureAdded";
        this.occurredOn = new Date();
    }
}
exports.AirLineFeatureAdded = AirLineFeatureAdded;
