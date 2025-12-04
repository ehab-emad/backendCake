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
exports.ReservationEntity = void 0;
const typeorm_1 = require("typeorm");
let ReservationEntity = class ReservationEntity {
};
exports.ReservationEntity = ReservationEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], ReservationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "reservation_number", length: 50, unique: true }),
    __metadata("design:type", String)
], ReservationEntity.prototype, "reservation_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], ReservationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "payment_status", length: 20, default: 'pending' }),
    __metadata("design:type", String)
], ReservationEntity.prototype, "payment_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "payment_id", type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "payment_id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { name: "client_id", length: 36, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "client_id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { name: "customer_id", length: 36, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "customer_id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { name: "room_id", length: 36, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "room_id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { name: "flight_id", length: 36, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { name: "trip_id", length: 36, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "trip_id", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "from_date", nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "to_date", nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "departure_date", nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "departure_date", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "return_date", nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "return_date", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "adult", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true, default: 0 }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "infant", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true, default: 1 }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2, nullable: true, default: 0.00 }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "seats", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { name: 'main_flight_seats', nullable: true }),
    __metadata("design:type", Array)
], ReservationEntity.prototype, "mainFlightSeats", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { name: 'transit_flight_seats', nullable: true }),
    __metadata("design:type", Array)
], ReservationEntity.prototype, "transitFlightSeats", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { name: 'return_flight_seats', nullable: true }),
    __metadata("design:type", Array)
], ReservationEntity.prototype, "returnFlightSeats", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 50, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "baggage", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "meals", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { name: "extra_baggage", nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "extraBaggage", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { name: "airport_transfer", nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "airportTransfer", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { name: "unlimited_internet", nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "unlimitedInternet", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "extras", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "name", type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "email", type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "gender", type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "latitude", type: "decimal", precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "longitude", type: "decimal", precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "nationality", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "passport_number", type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "passport_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "passport_expiry", type: "date", nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "passport_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "phone_number", type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "date_of_birth", type: "date", nullable: true }),
    __metadata("design:type", Object)
], ReservationEntity.prototype, "date_of_birth", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], ReservationEntity.prototype, "created_at", void 0);
exports.ReservationEntity = ReservationEntity = __decorate([
    (0, typeorm_1.Entity)("reservations")
], ReservationEntity);
