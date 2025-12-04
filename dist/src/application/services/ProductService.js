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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.ProductService = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const Product_1 = require("../../core/entities/Product");
const ProductImage_1 = require("../../core/entities/ProductImage");
const ProductRating_1 = require("../../core/entities/ProductRating");
const types_1 = require("../../shared/di/types");
let ProductService = class ProductService {
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    createProduct(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = (0, uuid_1.v4)();
            const product = new Product_1.Product(productId, dto.name, dto.clientId, dto.description, dto.fullDescription, dto.price, dto.stockQuantity, dto.imageUrl, dto.material, dto.beads, dto.length, dto.weight, dto.ratings && dto.ratings.length > 0 ? dto.ratings.reduce((acc, r) => acc + r.rating, 0) / dto.ratings.length : 0, 0, // sales
            dto.status, new Date(), new Date());
            if (dto.images) {
                for (const path of dto.images) {
                    product.addImage(new ProductImage_1.ProductImage((0, uuid_1.v4)(), productId, path));
                }
            }
            if (dto.ratings) {
                for (const rtgDto of dto.ratings) {
                    const rating = new ProductRating_1.ProductRating((0, uuid_1.v4)(), productId, rtgDto.name, rtgDto.comment, rtgDto.rating, rtgDto.images);
                    product.addRating(rating);
                }
            }
            yield this.productRepo.create(product);
            return product;
        });
    }
    getProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepo.findById(id);
            if (!product) {
                throw new Error("Product not found");
            }
            return product;
        });
    }
    listProducts(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.productRepo.listProducts(filters);
        });
    }
    updateProduct(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.getProduct(id);
            if (dto.name)
                product.name = dto.name;
            if (dto.clientId)
                product.clientId = dto.clientId;
            if (dto.description)
                product.description = dto.description;
            if (dto.fullDescription)
                product.fullDescription = dto.fullDescription;
            if (dto.price)
                product.price = dto.price;
            if (dto.stockQuantity)
                product.stockQuantity = dto.stockQuantity;
            if (dto.imageUrl)
                product.imageUrl = dto.imageUrl;
            if (dto.material)
                product.material = dto.material;
            if (dto.beads)
                product.beads = dto.beads;
            if (dto.length)
                product.length = dto.length;
            if (dto.weight)
                product.weight = dto.weight;
            if (dto.status)
                product.status = dto.status;
            if (dto.newImages && dto.newImages.length > 0) {
                for (const path of dto.newImages) {
                    product.addImage(new ProductImage_1.ProductImage((0, uuid_1.v4)(), id, path));
                }
            }
            if (dto.removeImageIds && dto.removeImageIds.length > 0) {
                for (const imageId of dto.removeImageIds) {
                    product.removeImage(imageId);
                }
            }
            yield this.productRepo.update(product);
            return product;
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.productRepo.delete(id);
        });
    }
    addRating(productId, ratingDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.getProduct(productId);
            const rating = new ProductRating_1.ProductRating((0, uuid_1.v4)(), productId, ratingDto.name, ratingDto.comment, ratingDto.rating, ratingDto.images);
            product.addRating(rating);
            yield this.productRepo.addRating(productId, rating);
            return product;
        });
    }
    removeImage(productId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.getProduct(productId);
            product.removeImage(imageId);
            yield this.productRepo.removeImage(imageId);
            return this.productRepo.listImagesForProduct(productId);
        });
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProductRepository)),
    __metadata("design:paramtypes", [Object])
], ProductService);
