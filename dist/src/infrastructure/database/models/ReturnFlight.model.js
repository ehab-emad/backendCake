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
exports.ReturnFlightEntity = void 0;
const typeorm_1 = require("typeorm");
const Flight_model_1 = require("./Flight.model");
const AirLine_model_1 = require("./AirLine.model");
let ReturnFlightEntity = class ReturnFlightEntity {
};
exports.ReturnFlightEntity = ReturnFlightEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "flight_id", type: "char", length: 36 }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "flightId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Flight_model_1.FlightEntity, (flight) => flight.returnFlights, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "flight_id" }),
    __metadata("design:type", Flight_model_1.FlightEntity)
], ReturnFlightEntity.prototype, "flight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], ReturnFlightEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "airline_id", type: "char", length: 36, nullable: true }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "airlineId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AirLine_model_1.AirLineEntity, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'airline_id' }),
    __metadata("design:type", AirLine_model_1.AirLineEntity)
], ReturnFlightEntity.prototype, "airlineRelation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "client_id", type: "char", length: 36, nullable: true }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Array)
], ReturnFlightEntity.prototype, "seats", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 2, default: 0, nullable: true }),
    __metadata("design:type", Number)
], ReturnFlightEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "departure_city", type: "varchar", length: 100 }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "departureCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "arrival_city", type: "varchar", length: 100 }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "arrivalCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "departure_iata", type: "varchar", length: 10 }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "departureIata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "arrival_iata", type: "varchar", length: 10 }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "arrivalIata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "departure_time", type: "timestamp" }),
    __metadata("design:type", Date)
], ReturnFlightEntity.prototype, "departureTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "arrival_time", type: "timestamp" }),
    __metadata("design:type", Date)
], ReturnFlightEntity.prototype, "arrivalTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], ReturnFlightEntity.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "flight_number", type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "flightNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "airline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ReturnFlightEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10, default: "AED" }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "number_of_stops", type: "int", default: 0 }),
    __metadata("design:type", Number)
], ReturnFlightEntity.prototype, "numberOfStops", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "available_seats", type: "int", default: 0 }),
    __metadata("design:type", Number)
], ReturnFlightEntity.prototype, "availableSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "aircraft_type", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "aircraftType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "aircraft_image", type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "aircraftImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "seat_layout", type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "seatLayout", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "seat_pitch", type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], ReturnFlightEntity.prototype, "seatPitch", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], ReturnFlightEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "updated_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], ReturnFlightEntity.prototype, "updatedAt", void 0);
exports.ReturnFlightEntity = ReturnFlightEntity = __decorate([
    (0, typeorm_1.Entity)("return_flights")
], ReturnFlightEntity);
