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
exports.ProductRatingRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const ProductRating_model_1 = require("../models/ProductRating.model");
const ProductRating_1 = require("../../../core/entities/ProductRating");
let ProductRatingRepository = class ProductRatingRepository {
    constructor() {
        this.repo = database_config_1.AppDataSource.getRepository(ProductRating_model_1.ProductRatingEntity);
    }
    toDomain(entity) {
        return new ProductRating_1.ProductRating(entity.id, entity.productId, entity.name, entity.comment, entity.rating, entity.images);
    }
    toEntity(domain) {
        const entity = new ProductRating_model_1.ProductRatingEntity();
        entity.id = domain.id;
        entity.productId = domain.productId;
        entity.name = domain.name;
        entity.comment = domain.comment;
        entity.rating = domain.rating;
        entity.images = domain.images;
        return entity;
    }
    create(rating) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.repo.create(this.toEntity(rating));
            yield this.repo.save(entity);
        });
    }
    listForProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.repo.find({ where: { productId } });
            return entities.map(this.toDomain);
        });
    }
    removeById(ratingId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(ratingId);
        });
    }
};
exports.ProductRatingRepository = ProductRatingRepository;
exports.ProductRatingRepository = ProductRatingRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ProductRatingRepository);
