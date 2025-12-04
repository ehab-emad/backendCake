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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Hotel_model_1 = require("../models/Hotel.model");
const Hotel_1 = require("../../../core/entities/Hotel");
const HotelImage_1 = require("../../../core/entities/HotelImage");
const HotelAmenity_1 = require("../../../core/entities/HotelAmenity");
const HotelRating_1 = require("../../../core/entities/HotelRating");
const HotelAmenity_model_1 = require("../models/HotelAmenity.model");
const HotelImage_model_1 = require("../models/HotelImage.model");
const HotelRating_model_1 = require("../models/HotelRating.model");
let HotelRepository = class HotelRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized) {
            throw new Error("Data source is not initialized");
        }
        return database_config_1.AppDataSource.getRepository(Hotel_model_1.HotelEntity);
    }
    create(hotel) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(hotel));
        });
    }
    update(hotel) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.toEntity(hotel);
            // First, update the hotel without relations
            const { ratings } = entity, hotelData = __rest(entity, ["ratings"]);
            yield this.repo.update(hotel.id, hotelData);
            // Then handle the ratings separately if they exist
            if (ratings && ratings.length > 0) {
                const ratingRepo = this.repo.manager.getRepository(HotelRating_model_1.HotelRatingEntity);
                // Remove existing ratings
                yield ratingRepo.delete({ hotel_id: hotel.id });
                // Add updated ratings
                for (const rating of ratings) {
                    yield ratingRepo.save(rating);
                }
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo
                .createQueryBuilder("hotel")
                .leftJoinAndSelect("hotel.images", "images")
                .leftJoinAndSelect("hotel.amenities", "amenities")
                .leftJoinAndSelect("hotel.ratings", "ratings")
                .where("hotel.id = :id", { id })
                .getOne();
            return ent ? this.toDomain(ent) : null;
        });
    }
    getHotel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield this.findById(id);
            if (!hotel) {
                throw new Error(`Hotel with id ${id} not found`);
            }
            return hotel;
        });
    }
    exists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.repo
                .createQueryBuilder("hotel")
                .where("hotel.id = :id", { id })
                .getCount();
            return count > 0;
        });
    }
    findAllByClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({ where: { clientId } });
            return ents.map((e) => this.toDomain(e));
        });
    }
    findAndCount(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create base query builder with relations
            let qb = this.repo
                .createQueryBuilder("h")
                .leftJoinAndSelect("h.images", "images")
                .leftJoinAndSelect("h.amenities", "amenities")
                .leftJoinAndSelect("h.ratings", "ratings");
            // Apply client filter
            if (filters.clientId) {
                qb = qb.where("h.client_id = :clientId", { clientId: filters.clientId });
            }
            // Apply status filter
            if (filters.status && filters.status !== "all") {
                qb = qb.andWhere("h.status = :status", { status: filters.status === "active" });
            }
            // Apply search by name
            if (filters.name) {
                qb = qb.andWhere("LOWER(h.name) LIKE :name", {
                    name: `%${filters.name.toLowerCase()}%`,
                });
            }
            // Apply location filter
            if (filters.location) {
                qb = qb.andWhere("LOWER(h.location) LIKE :location", {
                    location: `%${filters.location.toLowerCase()}%`,
                });
            }
            // Apply city filter (case-insensitive partial match)
            if (filters.city) {
                qb = qb.andWhere("LOWER(h.city) LIKE :city", {
                    city: `%${filters.city.toLowerCase()}%`,
                });
            }
            // Apply rating filters
            if (filters.minRating !== undefined) {
                qb = qb.andWhere("h.rating >= :minRating", { minRating: filters.minRating });
            }
            if (filters.maxRating !== undefined) {
                qb = qb.andWhere("h.rating <= :maxRating", { maxRating: filters.maxRating });
            }
            // Apply price filters
            if (filters.minPrice !== undefined) {
                qb = qb.andWhere("h.price >= :minPrice", { minPrice: filters.minPrice });
            }
            if (filters.maxPrice !== undefined) {
                qb = qb.andWhere("h.price <= :maxPrice", { maxPrice: filters.maxPrice });
            }
            // Apply amenities filter (comma-separated list)
            if (filters.amenities) {
                const amenityIds = filters.amenities.split(',').map(id => id.trim());
                if (amenityIds.length > 0) {
                    qb = qb.andWhere("EXISTS (SELECT 1 FROM hotel_amenities_amenity haa WHERE haa.hotelId = h.id AND haa.amenityId IN (:...amenityIds))", {
                        amenityIds
                    });
                }
            }
            // Apply room types filter (comma-separated list)
            if (filters.roomTypes) {
                const roomTypes = filters.roomTypes.split(',').map(type => type.trim().toLowerCase());
                if (roomTypes.length > 0) {
                    qb = qb.andWhere("LOWER(h.room_types) LIKE ANY(:roomTypes)", {
                        roomTypes: roomTypes.map(type => `%${type}%`)
                    });
                }
            }
            // Get total count with current filters before applying pagination
            const totalItems = yield qb.getCount();
            // Apply sorting
            if (filters.sortBy) {
                const orderDirection = (filters.sortOrder || 'asc').toUpperCase();
                switch (filters.sortBy) {
                    case 'price':
                        qb = qb.orderBy("h.price", orderDirection);
                        break;
                    case 'rating':
                        qb = qb.orderBy("h.rating", orderDirection);
                        break;
                    case 'name':
                        qb = qb.orderBy("h.name", orderDirection);
                        break;
                    default:
                        qb = qb.orderBy("h.created_at", "DESC");
                }
            }
            else {
                // Default sorting
                qb = qb.orderBy("h.created_at", "DESC");
            }
            // Apply pagination
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            qb = qb.skip((page - 1) * limit).take(limit);
            // Execute the query and map to domain models
            const [hotels, total] = yield qb.getManyAndCount();
            return [hotels.map(h => this.toDomain(h)), total];
        });
    }
    toDomain(ent) {
        // Ensure we have arrays for images and amenities, even if they're not loaded
        const images = Array.isArray(ent.images)
            ? ent.images.map(i => new HotelImage_1.HotelImage(i.id, i.hotel_id, i.path))
            : [];
        const amenities = Array.isArray(ent.amenities)
            ? ent.amenities.map(a => new HotelAmenity_1.HotelAmenity(a.id, a.hotel_id, a.name))
            : [];
        const hotel = new Hotel_1.Hotel(ent.id, ent.clientId, ent.status, parseFloat(ent.rating), parseFloat(ent.price), ent.name, ent.branchName || '', ent.contactNumber || '', ent.contactPerson || '', ent.country, ent.city, ent.address, ent.description, parseFloat(ent.commission || '0'), ent.contractStartDate, ent.contractEndDate, ent.generalAmenities, ent.diningAmenities, ent.wellnessAmenities, ent.businessAmenities, ent.otherAmenities, ent.map, ent.latitude != null ? parseFloat(ent.latitude) : undefined, ent.longitude != null ? parseFloat(ent.longitude) : undefined, ent.imageUrls || [], ent.meals, ent.unlimitedInternet, ent.airportTransfer, ent.created_at, ent.updated_at);
        // Add images and amenities
        if (ent.images) {
            ent.images.forEach(img => {
                hotel.addImage(new HotelImage_1.HotelImage(img.id, img.hotel_id, img.path));
            });
        }
        if (ent.amenities) {
            ent.amenities.forEach(am => {
                hotel.addAmenity(new HotelAmenity_1.HotelAmenity(am.id, am.hotel_id, am.name));
            });
        }
        // Add ratings if they exist
        if (ent.ratings) {
            ent.ratings.forEach(rating => {
                hotel.ratings.push(new HotelRating_1.HotelRating(rating.id, rating.hotel_id, rating.name, rating.comment || '', rating.rating, rating.images || [], rating.created_at, rating.updated_at));
            });
        }
        return hotel;
    }
    toEntity(hotel) {
        var _a;
        const ent = new Hotel_model_1.HotelEntity();
        ent.id = hotel.id;
        ent.clientId = hotel.clientId;
        ent.status = hotel.status;
        ent.rating = hotel.rating;
        ent.price = hotel.price;
        ent.name = hotel.name;
        ent.branchName = hotel.branchName;
        ent.contactNumber = hotel.contactNumber;
        ent.contactPerson = hotel.contactPerson;
        ent.country = hotel.country;
        ent.city = hotel.city;
        ent.address = hotel.address;
        ent.description = hotel.description;
        ent.commission = ((_a = hotel.commissionRate) === null || _a === void 0 ? void 0 : _a.toString()) || '0';
        ent.contractStartDate = hotel.contractStartDate;
        ent.contractEndDate = hotel.contractEndDate;
        ent.generalAmenities = hotel.generalAmenities;
        ent.diningAmenities = hotel.diningAmenities;
        ent.wellnessAmenities = hotel.wellnessAmenities;
        ent.businessAmenities = hotel.businessAmenities;
        ent.otherAmenities = hotel.otherAmenities;
        ent.map = hotel.map;
        ent.meals = hotel.meals;
        ent.unlimitedInternet = hotel.unlimitedInternet;
        ent.airportTransfer = hotel.airportTransfer;
        ent.latitude = hotel.latitude != null ? hotel.latitude.toString() : undefined;
        ent.longitude = hotel.longitude != null ? hotel.longitude.toString() : undefined;
        // Handle images and amenities if needed
        if (hotel.images) {
            ent.images = hotel.images.map(img => {
                const imgEnt = new HotelImage_model_1.HotelImageEntity();
                imgEnt.id = img.id;
                imgEnt.hotel_id = img.hotelId;
                imgEnt.path = img.path;
                return imgEnt;
            });
        }
        if (hotel.amenities) {
            ent.amenities = hotel.amenities.map(am => {
                const amEnt = new HotelAmenity_model_1.HotelAmenityEntity();
                amEnt.id = am.id;
                amEnt.hotel_id = am.hotelId;
                amEnt.name = am.name;
                return amEnt;
            });
        }
        if (hotel.ratings) {
            ent.ratings = hotel.ratings.map(rating => {
                const ratingEnt = new HotelRating_model_1.HotelRatingEntity();
                ratingEnt.id = rating.id;
                ratingEnt.hotel_id = rating.hotelId;
                ratingEnt.name = rating.name;
                ratingEnt.comment = rating.comment;
                ratingEnt.rating = rating.rating;
                ratingEnt.images = rating.images;
                ratingEnt.created_at = rating.createdAt;
                ratingEnt.updated_at = rating.updatedAt;
                return ratingEnt;
            });
        }
        return ent;
    }
};
exports.HotelRepository = HotelRepository;
exports.HotelRepository = HotelRepository = __decorate([
    (0, inversify_1.injectable)()
], HotelRepository);
