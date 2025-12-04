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
exports.TripRatingEntity = void 0;
const typeorm_1 = require("typeorm");
const Trip_model_1 = require("./Trip.model");
let TripRatingEntity = class TripRatingEntity {
};
exports.TripRatingEntity = TripRatingEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], TripRatingEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], TripRatingEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], TripRatingEntity.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 3, scale: 2 }),
    __metadata("design:type", Number)
], TripRatingEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Array)
], TripRatingEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], TripRatingEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], TripRatingEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], TripRatingEntity.prototype, "trip_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Trip_model_1.TripEntity, (t) => t.id, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "trip_id" }),
    __metadata("design:type", Trip_model_1.TripEntity)
], TripRatingEntity.prototype, "trip", void 0);
exports.TripRatingEntity = TripRatingEntity = __decorate([
    (0, typeorm_1.Entity)("trip_rating")
], TripRatingEntity);
