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
exports.TripEntity = void 0;
const typeorm_1 = require("typeorm");
const TripSchedule_model_1 = require("./TripSchedule.model");
const TripImage_model_1 = require("./TripImage.model");
const TripHotel_model_1 = require("./TripHotel.model");
const TripFlight_model_1 = require("./TripFlight.model");
let TripEntity = class TripEntity {
    constructor() {
        this.includeProgram = [];
        this.noIncludeProgram = [];
    }
};
exports.TripEntity = TripEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], TripEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], TripEntity.prototype, "client_id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 255 }),
    __metadata("design:type", String)
], TripEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean"),
    __metadata("design:type", Boolean)
], TripEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 4, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], TripEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 255 }),
    __metadata("design:type", String)
], TripEntity.prototype, "departure", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 255 }),
    __metadata("design:type", String)
], TripEntity.prototype, "arrival", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 50 }),
    __metadata("design:type", String)
], TripEntity.prototype, "trip_duration", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean"),
    __metadata("design:type", Boolean)
], TripEntity.prototype, "includes_hotel", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean"),
    __metadata("design:type", Boolean)
], TripEntity.prototype, "includes_flight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TripEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'includeProgram', nullable: true, default: '[]' }),
    __metadata("design:type", Array)
], TripEntity.prototype, "includeProgram", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'noIncludeProgram', nullable: true, default: '[]' }),
    __metadata("design:type", Array)
], TripEntity.prototype, "noIncludeProgram", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], TripEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { default: 1 }),
    __metadata("design:type", Number)
], TripEntity.prototype, "days", void 0);
__decorate([
    (0, typeorm_1.Column)("date"),
    __metadata("design:type", Date)
], TripEntity.prototype, "departure_date", void 0);
__decorate([
    (0, typeorm_1.Column)("date"),
    __metadata("design:type", Date)
], TripEntity.prototype, "return_date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TripEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TripEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TripSchedule_model_1.TripScheduleEntity, (s) => s.trip),
    __metadata("design:type", Array)
], TripEntity.prototype, "schedule", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TripImage_model_1.TripImageEntity, (i) => i.trip),
    __metadata("design:type", Array)
], TripEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TripHotel_model_1.TripHotelEntity, (h) => h.trip),
    __metadata("design:type", Array)
], TripEntity.prototype, "hotels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TripFlight_model_1.TripFlightEntity, (f) => f.trip),
    __metadata("design:type", Array)
], TripEntity.prototype, "flights", void 0);
exports.TripEntity = TripEntity = __decorate([
    (0, typeorm_1.Entity)("trips")
], TripEntity);
