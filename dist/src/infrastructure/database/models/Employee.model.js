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
exports.EmployeeEntity = void 0;
const typeorm_1 = require("typeorm");
const Auth_model_1 = require("./Auth.model");
const EmployeeImage_model_1 = require("./EmployeeImage.model");
let EmployeeEntity = class EmployeeEntity {
};
exports.EmployeeEntity = EmployeeEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "char", length: 36 }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "auth_user_id", type: "char", length: 36 }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "authUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Auth_model_1.AuthEntity, (u) => u.employees, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "auth_user_id" }),
    __metadata("design:type", Auth_model_1.AuthEntity)
], EmployeeEntity.prototype, "authUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "profile_image",
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "profileImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], EmployeeEntity.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EmployeeImage_model_1.EmployeeImageEntity, (img) => img.employee),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "updatedAt", void 0);
exports.EmployeeEntity = EmployeeEntity = __decorate([
    (0, typeorm_1.Entity)("employees")
], EmployeeEntity);
