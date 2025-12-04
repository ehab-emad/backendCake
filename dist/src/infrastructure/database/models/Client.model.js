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
exports.ClientEntity = void 0;
const typeorm_1 = require("typeorm");
const ClientAttachment_model_1 = require("./ClientAttachment.model");
const Product_model_1 = require("./Product.model");
let ClientEntity = class ClientEntity {
};
exports.ClientEntity = ClientEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "char",
        length: "36",
        charset: "utf8mb4",
        collation: "utf8mb4_unicode_ci",
    }),
    __metadata("design:type", String)
], ClientEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: "100" }),
    __metadata("design:type", String)
], ClientEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: "255", unique: true }),
    __metadata("design:type", String)
], ClientEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ClientEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: "255", nullable: true }),
    __metadata("design:type", Object)
], ClientEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: "20", nullable: true }),
    __metadata("design:type", Object)
], ClientEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: "255",
        nullable: true,
        name: "profile_image",
    }),
    __metadata("design:type", Object)
], ClientEntity.prototype, "profileImage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: "50",
        nullable: true,
        name: "license_number",
    }),
    __metadata("design:type", Object)
], ClientEntity.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", Object)
], ClientEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "website_url", type: "varchar", nullable: true }),
    __metadata("design:type", Object)
], ClientEntity.prototype, "websiteUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "additional_phone_number",
        type: "varchar",
        nullable: true,
    }),
    __metadata("design:type", Object)
], ClientEntity.prototype, "additionalPhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: "50",
        name: "subscription_type",
    }),
    __metadata("design:type", Object)
], ClientEntity.prototype, "subscriptionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], ClientEntity.prototype, "approved", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], ClientEntity.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ClientAttachment_model_1.ClientAttachmentEntity, (attachment) => attachment.client, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], ClientEntity.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product_model_1.ProductEntity, (product) => product.client, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], ClientEntity.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp" }),
    __metadata("design:type", Date)
], ClientEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp" }),
    __metadata("design:type", Date)
], ClientEntity.prototype, "updatedAt", void 0);
exports.ClientEntity = ClientEntity = __decorate([
    (0, typeorm_1.Entity)("clients")
], ClientEntity);
