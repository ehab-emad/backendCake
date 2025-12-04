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
exports.ProductImageEntity = void 0;
const typeorm_1 = require("typeorm");
const Product_model_1 = require("./Product.model");
let ProductImageEntity = class ProductImageEntity {
};
exports.ProductImageEntity = ProductImageEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "char",
        length: "36",
        charset: "utf8mb4",
        collation: "utf8mb4_unicode_ci",
    }),
    __metadata("design:type", String)
], ProductImageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "product_id", type: "char", length: "36" }),
    __metadata("design:type", String)
], ProductImageEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_model_1.ProductEntity, (product) => product.images, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", Product_model_1.ProductEntity)
], ProductImageEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: "255" }),
    __metadata("design:type", String)
], ProductImageEntity.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], ProductImageEntity.prototype, "createdAt", void 0);
exports.ProductImageEntity = ProductImageEntity = __decorate([
    (0, typeorm_1.Entity)("product_images")
], ProductImageEntity);
