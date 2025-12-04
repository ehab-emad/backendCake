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
exports.ProductRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Product_model_1 = require("../models/Product.model");
const ProductImage_model_1 = require("../models/ProductImage.model");
const ProductRating_model_1 = require("../models/ProductRating.model");
const Product_1 = require("../../../core/entities/Product");
const ProductImage_1 = require("../../../core/entities/ProductImage");
const ProductRating_1 = require("../../../core/entities/ProductRating");
let ProductRepository = class ProductRepository {
    constructor() {
        this.productRepo = database_config_1.AppDataSource.getRepository(Product_model_1.ProductEntity);
        this.productImageRepo = database_config_1.AppDataSource.getRepository(ProductImage_model_1.ProductImageEntity);
        this.productRatingRepo = database_config_1.AppDataSource.getRepository(ProductRating_model_1.ProductRatingEntity);
    }
    toDomain(entity) {
        return new Product_1.Product(entity.id, entity.name, entity.clientId, entity.description, entity.fullDescription, entity.price, entity.stockQuantity, entity.imageUrl, entity.material, entity.beads, entity.length, entity.weight, entity.rating, entity.sales, entity.status, entity.createdAt, entity.updatedAt);
    }
    toEntity(domain) {
        const entity = new Product_model_1.ProductEntity();
        entity.id = domain.id;
        entity.name = domain.name;
        entity.clientId = domain.clientId;
        entity.description = domain.description;
        entity.fullDescription = domain.fullDescription;
        entity.price = domain.price;
        entity.stockQuantity = domain.stockQuantity;
        entity.imageUrl = domain.imageUrl;
        entity.material = domain.material;
        entity.beads = domain.beads;
        entity.length = domain.length;
        entity.weight = domain.weight;
        entity.rating = domain.rating;
        entity.sales = domain.sales;
        entity.status = domain.status;
        entity.createdAt = domain.createdAt || new Date();
        entity.updatedAt = domain.updatedAt || new Date();
        return entity;
    }
    create(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.productRepo.create(this.toEntity(product));
            yield this.productRepo.save(entity);
            if (product.images && product.images.length > 0) {
                const imageEntities = product.images.map(image => {
                    const img = new ProductImage_model_1.ProductImageEntity();
                    img.id = image.id;
                    img.productId = product.id;
                    img.path = image.path;
                    return img;
                });
                yield this.productImageRepo.save(imageEntities);
            }
            if (product.ratings && product.ratings.length > 0) {
                const ratingEntities = product.ratings.map(rating => {
                    const rtg = new ProductRating_model_1.ProductRatingEntity();
                    rtg.id = rating.id;
                    rtg.productId = product.id;
                    rtg.name = rating.name;
                    rtg.comment = rating.comment;
                    rtg.rating = rating.rating;
                    rtg.images = rating.images;
                    return rtg;
                });
                yield this.productRatingRepo.save(ratingEntities);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.productRepo.findOne({
                where: { id },
                relations: ["images", "ratings", "client"],
            });
            if (!entity)
                return null;
            const product = this.toDomain(entity);
            product.images = entity.images.map(img => new ProductImage_1.ProductImage(img.id, img.productId, img.path));
            product.ratings = entity.ratings.map(rtg => new ProductRating_1.ProductRating(rtg.id, rtg.productId, rtg.name, rtg.comment, rtg.rating, rtg.images));
            return product;
        });
    }
    listProducts(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryBuilder = this.productRepo.createQueryBuilder("product");
            if (filters.name) {
                queryBuilder.andWhere("product.name LIKE :name", { name: `%${filters.name}%` });
            }
            if (filters.minPrice) {
                queryBuilder.andWhere("product.price >= :minPrice", { minPrice: filters.minPrice });
            }
            if (filters.maxPrice) {
                queryBuilder.andWhere("product.price <= :maxPrice", { maxPrice: filters.maxPrice });
            }
            if (filters.status) {
                queryBuilder.andWhere("product.status = :status", { status: filters.status });
            }
            if (filters.minRating) {
                queryBuilder.andWhere("product.rating >= :minRating", { minRating: filters.minRating });
            }
            if (filters.maxRating) {
                queryBuilder.andWhere("product.rating <= :maxRating", { maxRating: filters.maxRating });
            }
            if (filters.material) {
                queryBuilder.andWhere("product.material LIKE :material", { material: `%${filters.material}%` });
            }
            if (filters.beads) {
                queryBuilder.andWhere("product.beads LIKE :beads", { beads: `%${filters.beads}%` });
            }
            if (filters.length) {
                queryBuilder.andWhere("product.length LIKE :length", { length: `%${filters.length}%` });
            }
            if (filters.weight) {
                queryBuilder.andWhere("product.weight LIKE :weight", { weight: `%${filters.weight}%` });
            }
            if (filters.search) {
                queryBuilder.andWhere("("
                    + "product.name LIKE :search OR "
                    + "product.description LIKE :search OR "
                    + "product.fullDescription LIKE :search"
                    + ")", { search: `%${filters.search}%` });
            }
            queryBuilder.leftJoinAndSelect("product.images", "images");
            queryBuilder.leftJoinAndSelect("product.ratings", "ratings");
            queryBuilder.leftJoinAndSelect("product.client", "client");
            const [entities, total] = yield queryBuilder
                .skip((filters.page - 1) * filters.limit)
                .take(filters.limit)
                .getManyAndCount();
            const data = entities.map(entity => {
                const product = this.toDomain(entity);
                product.images = entity.images.map(img => new ProductImage_1.ProductImage(img.id, img.productId, img.path));
                product.ratings = entity.ratings.map(rtg => new ProductRating_1.ProductRating(rtg.id, rtg.productId, rtg.name, rtg.comment, rtg.rating, rtg.images));
                return product;
            });
            return { data, total };
        });
    }
    update(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.toEntity(product);
            yield this.productRepo.update(product.id, entity);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.productRepo.delete(id);
        });
    }
    addRating(productId, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepo.findOneBy({ id: productId });
            if (!product) {
                throw new Error("Product not found");
            }
            const ratingEntity = new ProductRating_model_1.ProductRatingEntity();
            ratingEntity.id = rating.id;
            ratingEntity.productId = productId;
            ratingEntity.name = rating.name;
            ratingEntity.comment = rating.comment;
            ratingEntity.rating = rating.rating;
            ratingEntity.images = rating.images;
            yield this.productRatingRepo.save(ratingEntity);
        });
    }
    removeImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.productImageRepo.delete(imageId);
        });
    }
    listImagesForProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = yield this.productImageRepo.find({ where: { productId } });
            return images.map(img => new ProductImage_1.ProductImage(img.id, img.productId, img.path));
        });
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ProductRepository);
