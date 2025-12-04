"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureRemoved = exports.FeatureAdded = exports.AirLineFeature = void 0;
const AggregateRoot_1 = require("./AggregateRoot");
class AirLineFeature extends AggregateRoot_1.AggregateRoot {
    constructor(id, airLineId, name) {
        super();
        this.id = id;
        this.airLineId = airLineId;
        this.name = name;
    }
    markAdded() {
        this.apply(new FeatureAdded(this.id, this.airLineId, this.name));
    }
    markRemoved() {
        this.apply(new FeatureRemoved(this.id, this.airLineId));
    }
}
exports.AirLineFeature = AirLineFeature;
class FeatureAdded {
    constructor(featureId, airLineId, name) {
        this.featureId = featureId;
        this.airLineId = airLineId;
        this.name = name;
        this.occurredOn = new Date();
    }
}
exports.FeatureAdded = FeatureAdded;
class FeatureRemoved {
    constructor(featureId, airLineId) {
        this.featureId = featureId;
        this.airLineId = airLineId;
        this.occurredOn = new Date();
    }
}
exports.FeatureRemoved = FeatureRemoved;
