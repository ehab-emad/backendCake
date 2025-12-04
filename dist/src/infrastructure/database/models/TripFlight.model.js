"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripFlightEntity = void 0;
const typeorm_1 = require("typeorm");
const Trip_model_1 = require("./Trip.model");
const Flight_model_1 = require("./Flight.model");
let TripFlightEntity = class TripFlightEntity {
};
exports.TripFlightEntity = TripFlightEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], TripFlightEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], TripFlightEntity.prototype, "trip_id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], TripFlightEntity.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Trip_model_1.TripEntity, (t) => t.flights, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "trip_id" }),
    __metadata("design:type", Trip_model_1.TripEntity)
], TripFlightEntity.prototype, "trip", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Flight_model_1.FlightEntity, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "flight_id" }),
    __metadata("design:type", Flight_model_1.FlightEntity)
], TripFlightEntity.prototype, "flight", void 0);
exports.TripFlightEntity = TripFlightEntity = __decorate([
    (0, typeorm_1.Entity)("trip_flights")
], TripFlightEntity);
