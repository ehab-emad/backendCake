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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirLineController = void 0;
const inversify_1 = require("inversify");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const AirLineService_1 = require("../../application/services/AirLineService");
const types_1 = require("../../shared/di/types");
const CreateAirLine_dto_1 = require("../../application/dto/CreateAirLine.dto");
const UpdateAirLine_dto_1 = require("../../application/dto/UpdateAirLine.dto");
const FilterAirLine_dto_1 = require("../../application/dto/FilterAirLine.dto");
const validation_middleware_1 = require("../middleware/validation.middleware");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
let AirLineController = class AirLineController {
    constructor(svc) {
        this.svc = svc;
        this.create = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const dto = CreateAirLine_dto_1.CreateAirLineSchema.parse(req.body);
                    const files = req.files;
                    if (files === null || files === void 0 ? void 0 : files.length) {
                        dto.images = files.map((f) => f.path);
                    }
                    const airLine = yield this.svc.createAirLine(dto);
                    res.status(201).json(airLine);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.list = [
            // authenticateJWT,
            (0, validation_middleware_1.validationMiddleware)(FilterAirLine_dto_1.FilterAirLineSchema, "query"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const filters = FilterAirLine_dto_1.FilterAirLineSchema.parse(req.query);
                    const result = yield this.svc.listAirLines(filters);
                    // Map the data to include image URLs and other relations
                    const data = result.data.map(airline => {
                        var _a;
                        return (Object.assign(Object.assign({}, airline), { images: ((_a = airline.images) === null || _a === void 0 ? void 0 : _a.map(img => {
                                const normalizedPath = img.path.replace(/\\/g, "/");
                                const cleanPath = normalizedPath.replace(/^\/+/, "");
                                return {
                                    id: img.id,
                                    airLineId: img.airLineId,
                                    path: normalizedPath,
                                    url: `${req.protocol}://${req.get("host")}/${cleanPath}`.replace(/([^:]\/)\/+/g, "$1"),
                                };
                            })) || [], features: airline.features || [], meals: airline.meals || [] }));
                    });
                    res.json(Object.assign(Object.assign({}, result), { data }));
                }
                catch (err) {
                    console.error('Error in AirLineController.list:', err);
                    next(err);
                }
            }),
        ];
        this.get = [
            // authenticateJWT,
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const fl = yield this.svc.getAirLine(req.params.id);
                    res.json({
                        id: fl.id,
                        clientId: fl.clientId,
                        companyName: fl.companyName,
                        rating: fl.rating,
                        phoneNumber: fl.phoneNumber,
                        email: fl.email,
                        iataCode: fl.iataCode,
                        country: fl.country,
                        city: fl.city,
                        flightType: fl.flightType,
                        mealsAvailable: fl.mealsAvailable,
                        specialOffers: fl.specialOffers,
                        collaborationStartDate: fl.collaborationStartDate,
                        contractDuration: fl.contractDuration,
                        commissionRate: fl.commissionRate,
                        status: fl.status,
                        airline_name: fl.airline_name,
                        airline_type: fl.airline_type,
                        isCharter: fl.isCharter,
                        contractStartDate: fl.contractStartDate,
                        contractEndDate: fl.contractEndDate,
                        additionalServices: fl.additionalServices,
                        specialAmenities: fl.specialAmenities,
                        logoUrl: fl.logoUrl,
                        promotionalImages: fl.promotionalImages,
                        documents: fl.documents,
                        images: fl.images.map((img) => {
                            const normalizedPath = img.path.replace(/\\/g, "/");
                            const cleanPath = normalizedPath.replace(/^\/+/, "");
                            return {
                                id: img.id,
                                airLineId: img.airLineId,
                                path: normalizedPath,
                                url: `${req.protocol}://${req.get("host")}/${cleanPath}`.replace(/([^:]\/)\/+/g, "$1"),
                            };
                        }),
                        features: fl.features.map((f) => ({
                            id: f.id,
                            airLineId: f.airLineId,
                            name: f.name,
                        })),
                        meals: fl.meals.map((m) => ({
                            id: m.id,
                            airLineId: m.airLineId,
                            name: m.name,
                        })),
                    });
                }
                catch (err) {
                    console.error('Error in AirLineController.get:', err);
                    next(err);
                }
            }),
        ];
        this.update = [
            AuthMiddleware_1.authenticateJWT,
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    // Parse the request body to get the DTO
                    const dto = UpdateAirLine_dto_1.UpdateAirLineSchema.parse(Object.assign(Object.assign({}, req.body), { 
                        // Parse imagesToRemove if it exists in the request body
                        imagesToRemove: req.body.imagesToRemove ? JSON.parse(req.body.imagesToRemove) : [], featuresToRemove: req.body.featuresToRemove ? JSON.parse(req.body.featuresToRemove) : [], 
                        // Parse other JSON string fields if needed
                        promotionalImages: req.body.promotionalImages ? JSON.parse(req.body.promotionalImages) : [], documents: req.body.documents ? JSON.parse(req.body.documents) : [], newFeatures: req.body.newFeatures ? JSON.parse(req.body.newFeatures) : [], newMeals: req.body.newMeals ? JSON.parse(req.body.newMeals) : [] }));
                    console.log('[AirLineController] Update DTO:', JSON.stringify(dto, null, 2));
                    // Handle file uploads
                    const files = req.files;
                    if (files === null || files === void 0 ? void 0 : files.length) {
                        dto.newImages = files.map((f) => f.path);
                        console.log(`[AirLineController] Added ${files.length} new images to DTO`);
                    }
                    else {
                        dto.newImages = [];
                    }
                    console.log('[AirLineController] Calling updateAirLine with:', {
                        id: req.params.id,
                        hasNewImages: ((_a = dto.newImages) === null || _a === void 0 ? void 0 : _a.length) > 0,
                        hasImagesToRemove: dto.imagesToRemove ? dto.imagesToRemove.length > 0 : false
                    });
                    const updated = yield this.svc.updateAirLine(req.params.id, dto);
                    // Map the response to include full image URLs
                    const response = Object.assign(Object.assign({}, updated), { images: ((_b = updated.images) === null || _b === void 0 ? void 0 : _b.map(img => {
                            const normalizedPath = img.path.replace(/\\/g, "/");
                            const cleanPath = normalizedPath.replace(/^\/+/, "");
                            return Object.assign(Object.assign({}, img), { url: `${req.protocol}://${req.get("host")}/${cleanPath}`.replace(/([^:]\/)\/+/g, "$1") });
                        })) || [] });
                    res.json(response);
                }
                catch (err) {
                    console.error('[AirLineController] Error in update:', err);
                    next(err);
                }
            }),
        ];
        this.delete = [
            AuthMiddleware_1.authenticateJWT,
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.svc.deleteAirLine(req.params.id);
                    res.sendStatus(204);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.removeImage = [
            AuthMiddleware_1.authenticateJWT,
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { id, imageId } = req.params;
                    const images = yield this.svc.listImages(id);
                    const found = images.find((i) => i.id === imageId);
                    if (!found) {
                        res.status(404).json({ error: "Image not found" });
                        return;
                    }
                    yield promises_1.default.unlink(path_1.default.resolve(found.path)).catch(() => { });
                    const remaining = yield this.svc.removeImage(id, imageId);
                    res.json(remaining);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.removeFeature = [
            AuthMiddleware_1.authenticateJWT,
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { id, featureId } = req.params;
                    const remaining = yield this.svc.removeFeature(id, featureId);
                    res.json(remaining);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.removeMeal = [
            AuthMiddleware_1.authenticateJWT,
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { id, mealId } = req.params;
                    const remaining = yield this.svc.removeMeal(id, mealId);
                    res.json(remaining);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
    }
};
exports.AirLineController = AirLineController;
exports.AirLineController = AirLineController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AirLineService)),
    __metadata("design:paramtypes", [AirLineService_1.AirLineService])
], AirLineController);
