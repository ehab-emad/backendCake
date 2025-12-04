"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirLineImageAdded = void 0;
class AirLineImageAdded {
    constructor(airLineId, imageId) {
        this.airLineId = airLineId;
        this.imageId = imageId;
        this.type = "AirLineImageAdded";
        this.occurredOn = new Date();
    }
}
exports.AirLineImageAdded = AirLineImageAdded;
