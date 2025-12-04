"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirLineFeatureRemoved = void 0;
class AirLineFeatureRemoved {
    constructor(airLineId, featureId) {
        this.airLineId = airLineId;
        this.featureId = featureId;
        this.type = "AirLineFeatureRemoved";
        this.occurredOn = new Date();
    }
}
exports.AirLineFeatureRemoved = AirLineFeatureRemoved;
