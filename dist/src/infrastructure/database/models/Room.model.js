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
exports.RoomEntity = exports.RoomCategory = void 0;
const typeorm_1 = require("typeorm");
const RoomImage_model_1 = require("./RoomImage.model");
const RoomAmenity_model_1 = require("./RoomAmenity.model");
var RoomCategory;
(function (RoomCategory) {
    RoomCategory["Single"] = "Single";
    RoomCategory["Double"] = "Double";
    RoomCategory["Suite"] = "Suite";
})(RoomCategory || (exports.RoomCategory = RoomCategory = {}));
let RoomEntity = class RoomEntity {
};
exports.RoomEntity = RoomEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36 }),
    __metadata("design:type", String)
], RoomEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], RoomEntity.prototype, "client_id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", { length: 36 }),
    __metadata("design:type", String)
], RoomEntity.prototype, "hotel_id", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { default: true }),
    __metadata("design:type", Boolean)
], RoomEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 255 }),
    __metadata("design:type", String)
], RoomEntity.prototype, "room_name", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", String)
], RoomEntity.prototype, "price_per_night", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 4, scale: 2, default: 0 }),
    __metadata("design:type", String)
], RoomEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 100 }),
    __metadata("design:type", String)
], RoomEntity.prototype, "room_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: RoomCategory,
        default: RoomCategory.Single,
    }),
    __metadata("design:type", String)
], RoomEntity.prototype, "room_category", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], RoomEntity.prototype, "max_occupancy", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { default: 0 }),
    __metadata("design:type", Number)
], RoomEntity.prototype, "single_bed_count", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { default: 0 }),
    __metadata("design:type", Number)
], RoomEntity.prototype, "double_bed_count", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], RoomEntity.prototype, "available_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], RoomEntity.prototype, "available_rooms", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], RoomEntity.prototype, "number_of_beds", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], RoomEntity.prototype, "number_of_guests", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 50 }),
    __metadata("design:type", String)
], RoomEntity.prototype, "room_size", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 100 }),
    __metadata("design:type", String)
], RoomEntity.prototype, "view", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], RoomEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 50, nullable: true }),
    __metadata("design:type", String)
], RoomEntity.prototype, "floor_type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], RoomEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], RoomEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RoomImage_model_1.RoomImageEntity, (image) => image.room, { cascade: true }),
    __metadata("design:type", Array)
], RoomEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RoomAmenity_model_1.RoomAmenityEntity, (amenity) => amenity.room, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], RoomEntity.prototype, "amenities", void 0);
exports.RoomEntity = RoomEntity = __decorate([
    (0, typeorm_1.Entity)("rooms")
], RoomEntity);
