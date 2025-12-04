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
exports.AirLineService = void 0;
const uuid_1 = require("uuid");
const inversify_1 = require("inversify");
const AirLineImage_1 = require("../../core/entities/AirLineImage");
const types_1 = require("../../shared/di/types");
const AirLine_model_1 = require("../../infrastructure/database/models/AirLine.model");
const AirLineImage_model_1 = require("../../infrastructure/database/models/AirLineImage.model");
const AirLineFeature_model_1 = require("../../infrastructure/database/models/AirLineFeature.model");
const AirLineMeal_model_1 = require("../../infrastructure/database/models/AirLineMeal.model");
let AirLineService = class AirLineService {
    constructor(repo, dataSource) {
        this.repo = repo;
        this.dataSource = dataSource;
    }
    listAirLines(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const [data, total] = yield this.repo.findAndCount(filters);
            return {
                data,
                total,
                page: (_a = filters.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = filters.limit) !== null && _b !== void 0 ? _b : 20,
            };
        });
    }
    createAirLine(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                const flRepo = manager.getRepository(AirLine_model_1.AirLineEntity);
                const now = new Date();
                const flEnt = flRepo.create({
                    id,
                    clientId: dto.clientId,
                    companyName: dto.companyName,
                    rating: dto.rating,
                    phoneNumber: dto.phoneNumber,
                    email: dto.email,
                    iataCode: dto.iataCode,
                    country: dto.country,
                    city: dto.city,
                    flightType: dto.flightType,
                    mealsAvailable: dto.mealsAvailable,
                    specialOffers: dto.specialOffers,
                    collaborationStartDate: dto.collaborationStartDate,
                    contractDuration: dto.contractDuration,
                    commissionRate: dto.commissionRate,
                    status: dto.status,
                    airline_name: dto.airline_name,
                    airline_type: dto.airline_type,
                    is_charter: (_a = dto.isCharter) !== null && _a !== void 0 ? _a : false,
                    contract_start_date: (_b = dto.contractStartDate) !== null && _b !== void 0 ? _b : null,
                    contract_end_date: (_c = dto.contractEndDate) !== null && _c !== void 0 ? _c : null,
                    additional_services: (_d = dto.additionalServices) !== null && _d !== void 0 ? _d : null,
                    special_amenities: (_e = dto.specialAmenities) !== null && _e !== void 0 ? _e : null,
                    logo_url: (_f = dto.logoUrl) !== null && _f !== void 0 ? _f : null,
                    promotional_images: (_g = dto.promotionalImages) !== null && _g !== void 0 ? _g : [],
                    documents: (_h = dto.documents) !== null && _h !== void 0 ? _h : [],
                    // createdAt/updatedAt are handled by decorators
                });
                yield flRepo.save(flEnt);
                if (dto.images) {
                    console.log(`[createAirLine] Processing ${dto.images.length} images for AirLine ${id}`);
                    const imgRepo = manager.getRepository(AirLineImage_model_1.AirLineImageEntity);
                    for (const p of dto.images) {
                        const imageId = (0, uuid_1.v4)();
                        console.log(`[createAirLine] Creating image record with ID: ${imageId}, path: ${p}`);
                        const imgEnt = imgRepo.create({
                            id: imageId,
                            airLineId: id,
                            path: p,
                            createdAt: new Date()
                        });
                        try {
                            yield imgRepo.save(imgEnt);
                            console.log(`[createAirLine] Successfully saved image ${imageId}`);
                        }
                        catch (error) {
                            console.error(`[createAirLine] Error saving image ${imageId}:`, error);
                            throw error; // Re-throw to trigger transaction rollback
                        }
                    }
                }
                else {
                    console.log('[createAirLine] No images to process');
                }
                if (dto.features) {
                    const featRepo = manager.getRepository(AirLineFeature_model_1.AirLineFeatureEntity);
                    for (const name of dto.features) {
                        const featEnt = featRepo.create({
                            id: (0, uuid_1.v4)(),
                            airLineId: id,
                            name,
                        });
                        yield featRepo.save(featEnt);
                    }
                }
                if (dto.meals) {
                    const mealRepo = manager.getRepository(AirLineMeal_model_1.AirLineMealEntity);
                    for (const name of dto.meals) {
                        const mealEnt = mealRepo.create({
                            id: (0, uuid_1.v4)(),
                            airLineId: id,
                            name,
                        });
                        yield mealRepo.save(mealEnt);
                    }
                }
            }));
            return this.loadFullAirLine(id);
        });
    }
    getAirLine(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`[getAirLine] Loading AirLine with ID: ${id}`);
                const airLine = yield this.loadFullAirLine(id);
                console.log(`[getAirLine] Successfully loaded AirLine:`, {
                    id: airLine.id,
                    companyName: airLine.companyName,
                    imagesCount: airLine.images.length
                });
                return airLine;
            }
            catch (error) {
                console.error(`[getAirLine] Error loading AirLine ${id}:`, error);
                throw error;
            }
        });
    }
    updateAirLine(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const airLineRepo = manager.getRepository(AirLine_model_1.AirLineEntity);
                // تحديث الحقول الأساسية
                // Map DTO fields (camelCase) to entity properties (snake_case where applicable)
                const fieldMap = {
                    companyName: 'companyName',
                    rating: 'rating',
                    phoneNumber: 'phoneNumber',
                    email: 'email',
                    iataCode: 'iataCode',
                    country: 'country',
                    city: 'city',
                    flightType: 'flightType',
                    mealsAvailable: 'mealsAvailable',
                    specialOffers: 'specialOffers',
                    collaborationStartDate: 'collaborationStartDate',
                    contractDuration: 'contractDuration',
                    commissionRate: 'commissionRate',
                    status: 'status',
                    airline_name: 'airline_name',
                    airline_type: 'airline_type',
                    isCharter: 'is_charter',
                    contractStartDate: 'contract_start_date',
                    contractEndDate: 'contract_end_date',
                    additionalServices: 'additional_services',
                    specialAmenities: 'special_amenities',
                    logoUrl: 'logo_url',
                    promotionalImages: 'promotional_images',
                    documents: 'documents',
                };
                const updateData = {};
                for (const [dtoKey, entityKey] of Object.entries(fieldMap)) {
                    if (dto[dtoKey] !== undefined) {
                        updateData[entityKey] = dto[dtoKey];
                    }
                }
                // Always update the updatedAt timestamp (property name)
                updateData.updatedAt = new Date();
                if (Object.keys(updateData).length > 0) {
                    yield airLineRepo.update(id, updateData);
                }
                // ✅ حذف الصور القديمة إذا تم إرسال صور جديدة
                const imgRepo = manager.getRepository(AirLineImage_model_1.AirLineImageEntity);
                if (dto.newImages && dto.newImages.length > 0) {
                    console.log(`[updateAirLine] Replacing all images for airline ${id}`);
                    // حذف كل الصور القديمة المرتبطة بالـ airline
                    yield imgRepo.delete({ airLineId: id });
                    // إضافة الصور الجديدة
                    const newImages = dto.newImages.map((path) => ({
                        id: (0, uuid_1.v4)(),
                        airLineId: id,
                        path,
                        createdAt: new Date(),
                    }));
                    yield imgRepo.save(newImages);
                }
                // ✅ تحديث المزايا (features)
                if (dto.newFeatures || (dto.featuresToRemove && dto.featuresToRemove.length > 0)) {
                    const featRepo = manager.getRepository(AirLineFeature_model_1.AirLineFeatureEntity);
                    if (dto.featuresToRemove && dto.featuresToRemove.length > 0) {
                        yield featRepo
                            .createQueryBuilder()
                            .delete()
                            .where('id IN (:...ids)', { ids: dto.featuresToRemove })
                            .execute();
                    }
                    if (dto.newFeatures && dto.newFeatures.length > 0) {
                        const features = dto.newFeatures.map((name) => featRepo.create({ id: (0, uuid_1.v4)(), airLineId: id, name }));
                        yield featRepo.save(features);
                    }
                }
                // ✅ تحديث الوجبات (meals)
                if (dto.newMeals && dto.newMeals.length > 0) {
                    const mealRepo = manager.getRepository(AirLineMeal_model_1.AirLineMealEntity);
                    const meals = dto.newMeals.map((name) => mealRepo.create({ id: (0, uuid_1.v4)(), airLineId: id, name }));
                    yield mealRepo.save(meals);
                }
            }));
            return this.loadFullAirLine(id);
        });
    }
    deleteAirLine(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    listImages(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource
                .getRepository(AirLineImage_model_1.AirLineImageEntity)
                .find({ where: { airLineId: id }, order: { createdAt: "ASC" } });
        });
    }
    removeImage(airLineId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.getRepository(AirLineImage_model_1.AirLineImageEntity).delete(imageId);
            return this.listImages(airLineId);
        });
    }
    removeFeature(airLineId, featureId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.getRepository(AirLineFeature_model_1.AirLineFeatureEntity).delete(featureId);
            return this.dataSource.getRepository(AirLineFeature_model_1.AirLineFeatureEntity).find({
                where: { airLineId },
                order: { name: "ASC" },
            });
        });
    }
    removeMeal(airLineId, mealId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.getRepository(AirLineMeal_model_1.AirLineMealEntity).delete(mealId);
            return this.dataSource.getRepository(AirLineMeal_model_1.AirLineMealEntity).find({
                where: { airLineId },
                order: { name: "ASC" },
            });
        });
    }
    loadFullAirLine(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[loadFullAirLine] Loading full AirLine data for ID: ${id}`);
            // Load AirLine with relations from repository
            const fl = yield this.repo.findById(id);
            if (!fl)
                throw new Error("AirLine not found");
            console.log(`[loadFullAirLine] Found AirLine: ${fl.companyName} (${fl.id})`);
            console.log(`[loadFullAirLine] Current images count: ${fl.images.length}`);
            // If no images were loaded by the repository, try direct query
            if (fl.images.length === 0) {
                console.log('[loadFullAirLine] No images loaded by repository, trying direct query...');
                try {
                    // Direct query to check images in the database
                    const rawImages = yield this.dataSource.query('SELECT * FROM air_line_images WHERE air_line_id = ?', [id]);
                    console.log(`[loadFullAirLine] Direct DB query found ${rawImages.length} images`);
                    // Repopulate images array if we found any
                    if (rawImages.length > 0) {
                        fl.images = []; // Clear existing empty array
                        rawImages.forEach((img) => {
                            console.log(`[loadFullAirLine] Adding image from direct query:`, {
                                id: img.id,
                                path: img.path
                            });
                            const image = new AirLineImage_1.AirLineImage(img.id, img.air_line_id, img.path);
                            fl.images.push(image);
                        });
                    }
                }
                catch (error) {
                    console.error('[loadFullAirLine] Error querying air_line_images:', error);
                }
            }
            // Log final state
            console.log(`[loadFullAirLine] Final images array:`, fl.images.map(img => ({
                id: img.id,
                airLineId: img.airLineId,
                path: img.path
            })));
            return fl;
        });
    }
};
exports.AirLineService = AirLineService;
exports.AirLineService = AirLineService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AirLineRepository)),
    __param(1, (0, inversify_1.inject)("DataSource")),
    __metadata("design:paramtypes", [Object, Function])
], AirLineService);
