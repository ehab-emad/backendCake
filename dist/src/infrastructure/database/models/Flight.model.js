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
exports.FlightEntity = void 0;
const typeorm_1 = require("typeorm");
const FlightBaggage_model_1 = require("./FlightBaggage.model");
const FlightAmenities_model_1 = require("./FlightAmenities.model");
const FlightMeals_model_1 = require("./FlightMeals.model");
const AirLine_model_1 = require("./AirLine.model");
let FlightEntity = class FlightEntity {
    constructor() {
        this.allSeats = 0;
    }
};
exports.FlightEntity = FlightEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "char", length: 36 }),
    __metadata("design:type", String)
], FlightEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], FlightEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "airline_id", type: "char", length: 36 }),
    __metadata("design:type", String)
], FlightEntity.prototype, "airlineId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AirLine_model_1.AirLineEntity, (airline) => airline.flights),
    (0, typeorm_1.JoinColumn)({ name: 'airline_id' }),
    __metadata("design:type", AirLine_model_1.AirLineEntity)
], FlightEntity.prototype, "airline", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "client_id", type: "char", length: 36 }),
    __metadata("design:type", String)
], FlightEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], FlightEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 2, default: 0, nullable: true }),
    __metadata("design:type", Number)
], FlightEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "departure_city", type: "varchar", length: 100 }),
    __metadata("design:type", String)
], FlightEntity.prototype, "departureCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "arrival_city", type: "varchar", length: 100 }),
    __metadata("design:type", String)
], FlightEntity.prototype, "arrivalCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "flight_number", type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], FlightEntity.prototype, "flightNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "number_of_stops", type: "int" }),
    __metadata("design:type", Number)
], FlightEntity.prototype, "numberOfStops", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10, nullable: true }),
    __metadata("design:type", String)
], FlightEntity.prototype, "gate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "flight_date", type: "date" }),
    __metadata("design:type", Date)
], FlightEntity.prototype, "flightDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "return_date", type: "date" }),
    __metadata("design:type", Date)
], FlightEntity.prototype, "returnDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "departure_time", type: "time" }),
    __metadata("design:type", String)
], FlightEntity.prototype, "departureTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "arrival_time", type: "time" }),
    __metadata("design:type", String)
], FlightEntity.prototype, "arrivalTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "flight_duration", type: "int" }),
    __metadata("design:type", Number)
], FlightEntity.prototype, "flightDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "available_seats", type: "int" }),
    __metadata("design:type", Number)
], FlightEntity.prototype, "availableSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "booking_class", type: "varchar", length: 50 }),
    __metadata("design:type", String)
], FlightEntity.prototype, "bookingClass", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "in_flight_entertainment", type: "varchar", length: 100 }),
    __metadata("design:type", String)
], FlightEntity.prototype, "inFlightEntertainment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "usb_port_outlet", type: "varchar", length: 100 }),
    __metadata("design:type", String)
], FlightEntity.prototype, "usbPortOutlet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], FlightEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], FlightEntity.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "aircraft_type", type: "varchar", length: 50 }),
    __metadata("design:type", String)
], FlightEntity.prototype, "aircraftType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "seat_layout", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], FlightEntity.prototype, "seatLayout", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "seat_pitch", type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], FlightEntity.prototype, "seatPitch", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "aircraft_image", type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], FlightEntity.prototype, "aircraftImage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], FlightEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], FlightEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", name: "transit", default: false }),
    __metadata("design:type", Boolean)
], FlightEntity.prototype, "transit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", name: "rest", length: 255, nullable: true }),
    __metadata("design:type", String)
], FlightEntity.prototype, "rest", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10, default: 'AED' }),
    __metadata("design:type", String)
], FlightEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "departureIata", type: "varchar", length: 10, nullable: true, default: null }),
    __metadata("design:type", Object)
], FlightEntity.prototype, "departureIata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "arrivalIata", type: "varchar", length: 10, nullable: true, default: null }),
    __metadata("design:type", Object)
], FlightEntity.prototype, "arrivalIata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_suggested", type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], FlightEntity.prototype, "isSuggested", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FlightBaggage_model_1.FlightBaggageEntity, (b) => b.flight),
    __metadata("design:type", Array)
], FlightEntity.prototype, "baggage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FlightAmenities_model_1.FlightAmenityEntity, (a) => a.flight),
    __metadata("design:type", Array)
], FlightEntity.prototype, "amenities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FlightMeals_model_1.FlightMealEntity, (m) => m.flight),
    __metadata("design:type", Array)
], FlightEntity.prototype, "flightMeals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('FlightRatingEntity', 'flight'),
    __metadata("design:type", Array)
], FlightEntity.prototype, "ratings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], FlightEntity.prototype, "meals", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, name: 'unlimited_internet' }),
    __metadata("design:type", Array)
], FlightEntity.prototype, "unlimitedInternet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, name: 'airport_transfer' }),
    __metadata("design:type", Array)
], FlightEntity.prototype, "airportTransfer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, name: 'extra_baggage' }),
    __metadata("design:type", Array)
], FlightEntity.prototype, "extraBaggage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], FlightEntity.prototype, "seats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'all_seats', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], FlightEntity.prototype, "allSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], FlightEntity.prototype, "transitFlights", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], FlightEntity.prototype, "returnFlights", void 0);
exports.FlightEntity = FlightEntity = __decorate([
    (0, typeorm_1.Entity)("flights")
], FlightEntity);
