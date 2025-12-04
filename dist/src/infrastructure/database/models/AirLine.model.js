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
exports.AirLineEntity = exports.AirlineType = void 0;
const typeorm_1 = require("typeorm");
const Client_model_1 = require("./Client.model");
var AirlineType;
(function (AirlineType) {
    AirlineType["International"] = "International";
    AirlineType["Domestic"] = "Domestic";
    AirlineType["Both"] = "Both";
})(AirlineType || (exports.AirlineType = AirlineType = {}));
const AirLineImage_model_1 = require("./AirLineImage.model");
const AirLineFeature_model_1 = require("./AirLineFeature.model");
const AirLineMeal_model_1 = require("./AirLineMeal.model");
let AirLineEntity = class AirLineEntity {
};
exports.AirLineEntity = AirLineEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "char", length: "36" }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "client_id", type: "char", length: "36" }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_model_1.ClientEntity, (c) => c.airLines),
    (0, typeorm_1.JoinColumn)({ name: "client_id" }),
    __metadata("design:type", Client_model_1.ClientEntity)
], AirLineEntity.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "company_name" }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 2, default: 0, nullable: true }),
    __metadata("design:type", Number)
], AirLineEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "phone_number" }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirLineEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "iata_code" }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "iataCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirLineEntity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirLineEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "flight_type",
        type: "enum",
        enum: ["international", "domestic"],
    }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "flightType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "meals_available", default: false }),
    __metadata("design:type", Boolean)
], AirLineEntity.prototype, "mealsAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "special_offers", default: false }),
    __metadata("design:type", Boolean)
], AirLineEntity.prototype, "specialOffers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "collaboration_start_date", type: "date" }),
    __metadata("design:type", Date)
], AirLineEntity.prototype, "collaborationStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "contract_duration", type: "int" }),
    __metadata("design:type", Number)
], AirLineEntity.prototype, "contractDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "commission_rate",
        type: "decimal",
        precision: 5,
        scale: 2,
        transformer: {
            to: (value) => value,
            from: (value) => parseFloat(value),
        },
    }),
    __metadata("design:type", Number)
], AirLineEntity.prototype, "commissionRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], AirLineEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "airline_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: AirlineType }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "airline_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], AirLineEntity.prototype, "is_charter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], AirLineEntity.prototype, "contract_start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], AirLineEntity.prototype, "contract_end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "additional_services", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "special_amenities", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, comment: "URL for airline logo image" }),
    __metadata("design:type", String)
], AirLineEntity.prototype, "logo_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true, comment: "JSON array of additional promotional image URLs" }),
    __metadata("design:type", Array)
], AirLineEntity.prototype, "promotional_images", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true, comment: "JSON array of contract/document image URLs" }),
    __metadata("design:type", Array)
], AirLineEntity.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AirLineImage_model_1.AirLineImageEntity, (img) => img.airLine),
    __metadata("design:type", Array)
], AirLineEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AirLineFeature_model_1.AirLineFeatureEntity, (f) => f.airLine),
    __metadata("design:type", Array)
], AirLineEntity.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AirLineMeal_model_1.AirLineMealEntity, (meal) => meal.airLine, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], AirLineEntity.prototype, "meals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('FlightEntity', 'airline'),
    __metadata("design:type", Array)
], AirLineEntity.prototype, "flights", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], AirLineEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], AirLineEntity.prototype, "updatedAt", void 0);
exports.AirLineEntity = AirLineEntity = __decorate([
    (0, typeorm_1.Entity)("air_lines")
], AirLineEntity);
