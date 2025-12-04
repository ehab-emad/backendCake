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
exports.CustomerEntity = void 0;
const typeorm_1 = require("typeorm");
const Auth_model_1 = require("./Auth.model");
let CustomerEntity = class CustomerEntity {
};
exports.CustomerEntity = CustomerEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "char", length: 36 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "auth_user_id", type: "char", length: 36 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "authUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Auth_model_1.AuthEntity, (a) => a.customers, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "auth_user_id" }),
    __metadata("design:type", Auth_model_1.AuthEntity)
], CustomerEntity.prototype, "authUser", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "customer_type",
        type: "enum",
        enum: ["VIP", "Regular"],
        default: "Regular",
    }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "customerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "passport_number",
        type: "varchar",
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "passportNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "national_id",
        type: "varchar",
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "nationalId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "national_id_expiry",
        type: "date",
        nullable: true,
    }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "nationalIdExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "address_line1",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "address_line2",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "city", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "country", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "registration_date", type: "date", nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "registrationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "expiration_date", type: "date", nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "expirationDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "customername", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "customername", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "email", type: "varchar", length: 150, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "phone_number", type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "profile_picture", type: "varchar", length: 500, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "locale", type: "varchar", length: 10, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "locale", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "gender", type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "first_name", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "last_name", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "latitude",
        type: "decimal",
        precision: 10,
        scale: 7,
        nullable: true
    }),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "longitude",
        type: "decimal",
        precision: 10,
        scale: 7,
        nullable: true
    }),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "date_of_birth", type: "date", nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "passport_expiry", type: "date", nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "passportExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "favorites",
        type: "json",
        nullable: false,
        default: () => "CAST('[]' AS JSON)",
        comment: 'List of favorite items with type and ID (e.g., [{"type": "flight", "id": "123"}, {"type": "hotel", "id": "456"}])',
    }),
    __metadata("design:type", Array)
], CustomerEntity.prototype, "favorites", void 0);
exports.CustomerEntity = CustomerEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "customers" })
], CustomerEntity);
