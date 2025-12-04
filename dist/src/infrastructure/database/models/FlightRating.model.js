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
exports.FlightRatingEntity = void 0;
const typeorm_1 = require("typeorm");
// Using string-based reference to avoid circular dependency
let FlightRatingEntity = class FlightRatingEntity {
};
exports.FlightRatingEntity = FlightRatingEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], FlightRatingEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], FlightRatingEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], FlightRatingEntity.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], FlightRatingEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Array)
], FlightRatingEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], FlightRatingEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], FlightRatingEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], FlightRatingEntity.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('FlightEntity', 'ratings', { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "flight_id" }),
    __metadata("design:type", Object)
], FlightRatingEntity.prototype, "flight", void 0);
exports.FlightRatingEntity = FlightRatingEntity = __decorate([
    (0, typeorm_1.Entity)("flight_rating")
], FlightRatingEntity);
