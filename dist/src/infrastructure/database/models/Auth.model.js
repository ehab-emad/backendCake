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
exports.AuthEntity = void 0;
const typeorm_1 = require("typeorm");
const Customer_model_1 = require("./Customer.model");
const Employee_model_1 = require("./Employee.model");
let AuthEntity = class AuthEntity {
};
exports.AuthEntity = AuthEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "char", length: 36 }),
    __metadata("design:type", String)
], AuthEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "first_name", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], AuthEntity.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "last_name", type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], AuthEntity.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, unique: true, nullable: true }),
    __metadata("design:type", Object)
], AuthEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "phone_number",
        type: "varchar",
        length: 20,
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", String)
], AuthEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "password_hash",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], AuthEntity.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["local", "google", "apple", "phone"],
        default: "local",
    }),
    __metadata("design:type", String)
], AuthEntity.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "provider_id",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", Object)
], AuthEntity.prototype, "providerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "phone_verified", type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], AuthEntity.prototype, "phoneVerified", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Customer_model_1.CustomerEntity, (c) => c.authUser),
    __metadata("design:type", Array)
], AuthEntity.prototype, "customers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Employee_model_1.EmployeeEntity, (e) => e.authUser),
    __metadata("design:type", Array)
], AuthEntity.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], AuthEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], AuthEntity.prototype, "updatedAt", void 0);
exports.AuthEntity = AuthEntity = __decorate([
    (0, typeorm_1.Entity)("auth_users")
], AuthEntity);
