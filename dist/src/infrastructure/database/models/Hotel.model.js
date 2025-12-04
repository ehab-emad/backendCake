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
exports.HotelEntity = void 0;
const typeorm_1 = require("typeorm");
const Client_model_1 = require("./Client.model");
const HotelImage_model_1 = require("./HotelImage.model");
const HotelAmenity_model_1 = require("./HotelAmenity.model");
let HotelEntity = class HotelEntity {
};
exports.HotelEntity = HotelEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)("char", { length: 36, name: "id" }),
    __metadata("design:type", String)
], HotelEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "client_id", type: "char", length: "36" }),
    __metadata("design:type", String)
], HotelEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_model_1.ClientEntity, (c) => c.hotels),
    (0, typeorm_1.JoinColumn)({ name: "client_id" }),
    __metadata("design:type", Client_model_1.ClientEntity)
], HotelEntity.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], HotelEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], HotelEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], HotelEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HotelEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "branch_name", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "branchName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "contact_number", type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "contactNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "contact_person", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "commission_rate",
        type: "decimal",
        precision: 5,
        scale: 2,
        default: 0.0,
    }),
    __metadata("design:type", String)
], HotelEntity.prototype, "commission", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "contract_start_date", type: "date", nullable: true }),
    __metadata("design:type", Date)
], HotelEntity.prototype, "contractStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "contract_end_date", type: "date", nullable: true }),
    __metadata("design:type", Date)
], HotelEntity.prototype, "contractEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "general_amenities", type: "text", nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "generalAmenities", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "dining_amenities", type: "text", nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "diningAmenities", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "wellness_amenities", type: "text", nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "wellnessAmenities", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "business_amenities", type: "text", nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "businessAmenities", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "other_amenities", type: "text", nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "otherAmenities", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "map", type: "varchar", nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "map", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "latitude", type: "decimal", precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "longitude", type: "decimal", precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", String)
], HotelEntity.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "image_urls", type: "json", nullable: true }),
    __metadata("design:type", Object)
], HotelEntity.prototype, "imageUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], HotelEntity.prototype, "meals", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unlimited_internet', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], HotelEntity.prototype, "unlimitedInternet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'airport_transfer', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], HotelEntity.prototype, "airportTransfer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HotelImage_model_1.HotelImageEntity, (i) => i.hotel),
    __metadata("design:type", Array)
], HotelEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('HotelRatingEntity', 'hotel', { cascade: true }),
    __metadata("design:type", Array)
], HotelEntity.prototype, "ratings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HotelAmenity_model_1.HotelAmenityEntity, (a) => a.hotel),
    __metadata("design:type", Array)
], HotelEntity.prototype, "amenities", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], HotelEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], HotelEntity.prototype, "updated_at", void 0);
exports.HotelEntity = HotelEntity = __decorate([
    (0, typeorm_1.Entity)("hotels")
], HotelEntity);
