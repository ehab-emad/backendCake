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
exports.AirLineImageEntity = void 0;
const typeorm_1 = require("typeorm");
const AirLine_model_1 = require("./AirLine.model");
let AirLineImageEntity = class AirLineImageEntity {
};
exports.AirLineImageEntity = AirLineImageEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "char", length: 36 }),
    __metadata("design:type", String)
], AirLineImageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "air_line_id", type: "char", length: "36" }),
    __metadata("design:type", String)
], AirLineImageEntity.prototype, "airLineId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "path", type: "varchar", length: 255 }),
    __metadata("design:type", String)
], AirLineImageEntity.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AirLine_model_1.AirLineEntity, (fl) => fl.images, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "air_line_id" }),
    __metadata("design:type", AirLine_model_1.AirLineEntity)
], AirLineImageEntity.prototype, "airLine", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], AirLineImageEntity.prototype, "createdAt", void 0);
exports.AirLineImageEntity = AirLineImageEntity = __decorate([
    (0, typeorm_1.Entity)("air_line_images")
], AirLineImageEntity);
