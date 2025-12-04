"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirLineImage = void 0;
const AggregateRoot_1 = require("./AggregateRoot");
const events_1 = require("../events");
class AirLineImage extends AggregateRoot_1.AggregateRoot {
    constructor(id, airLineId, path) {
        super();
        this.id = id;
        this.airLineId = airLineId;
        this.path = path;
    }
    markAdded() {
        this.apply(new events_1.AirLineImageAdded(this.airLineId, this.id));
    }
    markRemoved() {
        this.apply(new events_1.AirLineImageRemoved(this.airLineId, this.id));
    }
}
exports.AirLineImage = AirLineImage;
