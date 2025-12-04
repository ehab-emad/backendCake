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
exports.ProductController = void 0;
const inversify_1 = require("inversify");
const ProductService_1 = require("../../application/services/ProductService");
const types_1 = require("../../shared/di/types");
const CreateProduct_dto_1 = require("../../application/dto/CreateProduct.dto");
const UpdateProduct_dto_1 = require("../../application/dto/UpdateProduct.dto");
const FilterProduct_dto_1 = require("../../application/dto/FilterProduct.dto");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    listProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = FilterProduct_dto_1.FilterProductSchema.parse(req.query);
                const result = yield this.productService.listProducts(filters);
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = CreateProduct_dto_1.CreateProductSchema.parse(req.body);
                const product = yield this.productService.createProduct(dto);
                res.status(201).json(product);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.productService.getProduct(req.params.id);
                res.json(product);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = UpdateProduct_dto_1.UpdateProductSchema.parse(req.body);
                const product = yield this.productService.updateProduct(req.params.id, dto);
                res.json(product);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.productService.deleteProduct(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
    addRating(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const rating = req.body;
                const result = yield this.productService.addRating(id, rating);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    removeImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, imageId } = req.params;
                const images = yield this.productService.removeImage(productId, imageId);
                res.json(images);
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.ProductController = ProductController;
exports.ProductController = ProductController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ProductService)),
    __metadata("design:paramtypes", [ProductService_1.ProductService])
], ProductController);
