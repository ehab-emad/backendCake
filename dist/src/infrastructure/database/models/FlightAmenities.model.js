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
exports.FlightAmenityEntity = void 0;
const typeorm_1 = require("typeorm");
const Flight_model_1 = require("./Flight.model");
let FlightAmenityEntity = class FlightAmenityEntity {
};
exports.FlightAmenityEntity = FlightAmenityEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], FlightAmenityEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], FlightAmenityEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], FlightAmenityEntity.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Flight_model_1.FlightEntity, (f) => f.amenities, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "flight_id" }),
    __metadata("design:type", Flight_model_1.FlightEntity)
], FlightAmenityEntity.prototype, "flight", void 0);
exports.FlightAmenityEntity = FlightAmenityEntity = __decorate([
    (0, typeorm_1.Entity)("flight_amenities")
], FlightAmenityEntity);
