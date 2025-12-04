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
exports.TripHotelEntity = void 0;
const typeorm_1 = require("typeorm");
const Trip_model_1 = require("./Trip.model");
const Hotel_model_1 = require("./Hotel.model");
let TripHotelEntity = class TripHotelEntity {
};
exports.TripHotelEntity = TripHotelEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], TripHotelEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], TripHotelEntity.prototype, "trip_id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], TripHotelEntity.prototype, "hotel_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Trip_model_1.TripEntity, (t) => t.hotels, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "trip_id" }),
    __metadata("design:type", Trip_model_1.TripEntity)
], TripHotelEntity.prototype, "trip", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Hotel_model_1.HotelEntity, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "hotel_id" }),
    __metadata("design:type", Hotel_model_1.HotelEntity)
], TripHotelEntity.prototype, "hotel", void 0);
exports.TripHotelEntity = TripHotelEntity = __decorate([
    (0, typeorm_1.Entity)("trip_hotels")
], TripHotelEntity);
