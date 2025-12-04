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
exports.ProductRatingEntity = void 0;
const typeorm_1 = require("typeorm");
const Product_model_1 = require("./Product.model");
let ProductRatingEntity = class ProductRatingEntity {
};
exports.ProductRatingEntity = ProductRatingEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "char",
        length: "36",
        charset: "utf8mb4",
        collation: "utf8mb4_unicode_ci",
    }),
    __metadata("design:type", String)
], ProductRatingEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "product_id", type: "char", length: "36" }),
    __metadata("design:type", String)
], ProductRatingEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_model_1.ProductEntity, (product) => product.ratings, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", Product_model_1.ProductEntity)
], ProductRatingEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: "100" }),
    __metadata("design:type", String)
], ProductRatingEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: "" }),
    __metadata("design:type", String)
], ProductRatingEntity.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 2, scale: 1 }),
    __metadata("design:type", Number)
], ProductRatingEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: false, default: () => "CAST('[]' AS JSON)" }),
    __metadata("design:type", Array)
], ProductRatingEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], ProductRatingEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], ProductRatingEntity.prototype, "updatedAt", void 0);
exports.ProductRatingEntity = ProductRatingEntity = __decorate([
    (0, typeorm_1.Entity)("product_ratings")
], ProductRatingEntity);
