"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirLineImageRemoved = void 0;
class AirLineImageRemoved {
    constructor(airLineId, imageId) {
        this.airLineId = airLineId;
        this.imageId = imageId;
        this.type = "AirLineImageRemoved";
        this.occurredOn = new Date();
    }
}
exports.AirLineImageRemoved = AirLineImageRemoved;
