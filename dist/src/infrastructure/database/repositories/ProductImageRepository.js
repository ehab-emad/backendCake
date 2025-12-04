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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const ProductImage_model_1 = require("../models/ProductImage.model");
const ProductImage_1 = require("../../../core/entities/ProductImage");
let ProductImageRepository = class ProductImageRepository {
    constructor() {
        this.repo = database_config_1.AppDataSource.getRepository(ProductImage_model_1.ProductImageEntity);
    }
    toDomain(entity) {
        return new ProductImage_1.ProductImage(entity.id, entity.productId, entity.path);
    }
    toEntity(domain) {
        const entity = new ProductImage_model_1.ProductImageEntity();
        entity.id = domain.id;
        entity.productId = domain.productId;
        entity.path = domain.path;
        return entity;
    }
    create(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.repo.create(this.toEntity(image));
            yield this.repo.save(entity);
        });
    }
    listForProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.repo.find({ where: { productId } });
            return entities.map(this.toDomain);
        });
    }
    removeById(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(imageId);
        });
    }
};
exports.ProductImageRepository = ProductImageRepository;
exports.ProductImageRepository = ProductImageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ProductImageRepository);
