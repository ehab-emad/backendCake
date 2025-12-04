"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AirLineRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const AirLine_model_1 = require("../models/AirLine.model");
const AirLine_1 = require("../../../core/entities/AirLine");
const AirLineImage_1 = require("../../../core/entities/AirLineImage");
const AirLineFeature_1 = require("../../../core/entities/AirLineFeature");
const AirLineMeal_1 = require("../../../core/entities/AirLineMeal");
const AirLineMeal_model_1 = require("../models/AirLineMeal.model");
const AirLineImage_model_1 = require("../models/AirLineImage.model");
const AirLineFeature_model_1 = require("../models/AirLineFeature.model");
let AirLineRepository = class AirLineRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized)
            throw new Error("DataSource not initialized");
        return database_config_1.AppDataSource.getRepository(AirLine_model_1.AirLineEntity);
    }
    create(f) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(f));
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find();
            return ents.map((e) => this.toDomain(e));
        });
    }
    findAllByClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({ where: { clientId } });
            return ents.map((e) => this.toDomain(e));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo.findOne({
                where: { id },
                relations: ['images', 'features', 'meals']
            });
            return ent ? this.toDomain(ent) : null;
        });
    }
    update(f) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(f));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    findAndCount(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            let qb = this.repo.createQueryBuilder("a");
            // Add relations
            qb = qb
                .leftJoinAndSelect('a.images', 'images')
                .leftJoinAndSelect('a.features', 'features')
                .leftJoinAndSelect('a.meals', 'meals');
            if (filters.clientId) {
                qb = qb.where("a.clientId = :clientId", {
                    clientId: filters.clientId,
                });
            }
            if (filters.status && filters.status !== "all") {
                const flag = filters.status === "active";
                qb = qb.andWhere("a.status = :flag", { flag });
            }
            if (filters.name) {
                qb = qb.andWhere("a.companyName LIKE :name", {
                    name: `%${filters.name}%`,
                });
            }
            const page = (_a = filters.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = filters.limit) !== null && _b !== void 0 ? _b : 20;
            qb = qb
                .orderBy("a.companyName", "ASC")
                .skip((page - 1) * limit)
                .take(limit);
            // Execute query and map results
            const [ents, total] = yield qb.getManyAndCount();
            const airlines = ents.map((e) => this.toDomain(e));
            // Log the first airline's data for debugging
            if (airlines.length > 0) {
                console.log(`[findAndCount] First airline data:`, {
                    id: airlines[0].id,
                    companyName: airlines[0].companyName,
                    imagesCount: ((_c = airlines[0].images) === null || _c === void 0 ? void 0 : _c.length) || 0,
                    featuresCount: ((_d = airlines[0].features) === null || _d === void 0 ? void 0 : _d.length) || 0,
                    mealsCount: ((_e = airlines[0].meals) === null || _e === void 0 ? void 0 : _e.length) || 0
                });
            }
            return [airlines, total];
        });
    }
    toDomain(ent) {
        const airLine = new AirLine_1.AirLine(ent.id, ent.clientId, ent.companyName, typeof ent.rating === 'string' ? parseFloat(ent.rating) : (ent.rating || 0), // Ensure rating is a number
        ent.phoneNumber, ent.email, ent.iataCode, ent.country, ent.city, ent.flightType, ent.mealsAvailable, ent.specialOffers, new Date(ent.collaborationStartDate), ent.contractDuration, Number(ent.commissionRate), ent.status, ent.airline_name, ent.airline_type, ent.is_charter, ent.contract_start_date ? new Date(ent.contract_start_date) : undefined, ent.contract_end_date ? new Date(ent.contract_end_date) : undefined, ent.additional_services, ent.special_amenities, ent.logo_url, ent.promotional_images, ent.documents);
        // Map images if they exist
        if (ent.images && ent.images.length > 0) {
            ent.images.forEach(img => {
                const image = new AirLineImage_1.AirLineImage(img.id, img.airLineId, img.path);
                airLine.addImage(image);
            });
        }
        // Map features if they exist
        if (ent.features && ent.features.length > 0) {
            ent.features.forEach(feature => {
                const feat = new AirLineFeature_1.AirLineFeature(feature.id, feature.airLineId, feature.name);
                airLine.addFeature(feat);
            });
        }
        // Map meals if they exist
        if (ent.meals && ent.meals.length > 0) {
            ent.meals.forEach(meal => {
                const m = new AirLineMeal_1.AirLineMeal(meal.id, meal.airLineId, meal.name);
                airLine.addMeal(m);
            });
        }
        return airLine;
    }
    toEntity(f) {
        var _a, _b, _c;
        const e = new AirLine_model_1.AirLineEntity();
        Object.assign(e, {
            rating: typeof f.rating === 'string' ? parseFloat(f.rating) : (f.rating || 0),
            clientId: f.clientId,
            companyName: f.companyName,
            phoneNumber: f.phoneNumber,
            email: f.email,
            iataCode: f.iataCode,
            country: f.country,
            city: f.city,
            flightType: f.flightType,
            mealsAvailable: f.mealsAvailable,
            specialOffers: f.specialOffers,
            collaborationStartDate: f.collaborationStartDate,
            contractDuration: f.contractDuration,
            commissionRate: f.commissionRate,
            status: f.status,
            airline_name: f.airline_name,
            airline_type: f.airline_type,
            is_charter: f.isCharter,
            contract_start_date: f.contractStartDate,
            contract_end_date: f.contractEndDate,
            additional_services: f.additionalServices,
            special_amenities: f.specialAmenities,
            logo_url: f.logoUrl,
            promotional_images: f.promotionalImages,
            documents: f.documents,
            // 🔴 أضف ده عشان الصور والعناصر التانية تظهر
            images: (_a = f.images) === null || _a === void 0 ? void 0 : _a.map((img) => {
                const i = new AirLineImage_model_1.AirLineImageEntity();
                i.id = img.id;
                i.airLineId = img.airLineId;
                i.path = img.path;
                return i;
            }),
            features: (_b = f.features) === null || _b === void 0 ? void 0 : _b.map((ftr) => {
                const feature = new AirLineFeature_model_1.AirLineFeatureEntity();
                feature.id = ftr.id;
                feature.airLineId = ftr.airLineId;
                feature.name = ftr.name;
                return feature;
            }),
            meals: (_c = f.meals) === null || _c === void 0 ? void 0 : _c.map((ml) => {
                const meal = new AirLineMeal_model_1.AirLineMealEntity();
                meal.id = ml.id;
                meal.airLineId = ml.airLineId;
                meal.name = ml.name;
                return meal;
            }),
        });
        return e;
    }
};
exports.AirLineRepository = AirLineRepository;
exports.AirLineRepository = AirLineRepository = __decorate([
    (0, inversify_1.injectable)()
], AirLineRepository);
