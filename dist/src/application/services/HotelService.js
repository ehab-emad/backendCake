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
exports.HotelService = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const Hotel_1 = require("../../core/entities/Hotel");
const Hotel_model_1 = require("../../infrastructure/database/models/Hotel.model");
const HotelImage_model_1 = require("../../infrastructure/database/models/HotelImage.model");
const HotelAmenity_model_1 = require("../../infrastructure/database/models/HotelAmenity.model");
const types_1 = require("../../shared/di/types");
const HotelImage_1 = require("../../core/entities/HotelImage");
const HotelAmenity_1 = require("../../core/entities/HotelAmenity");
const HotelRating_model_1 = require("../../infrastructure/database/models/HotelRating.model");
const HotelRating_1 = require("../../core/entities/HotelRating");
let HotelService = class HotelService {
    constructor(hotelRepo, ratingRepo, dataSource) {
        this.hotelRepo = hotelRepo;
        this.ratingRepo = ratingRepo;
        this.dataSource = dataSource;
    }
    listHotels(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get paginated and filtered hotels from repository
                const [hotels, total] = yield this.hotelRepo.findAndCount(filters);
                // Process each hotel to ensure proper data types and load additional data if needed
                const processedHotels = yield Promise.all(hotels.map((hotel) => {
                    // Create a new Hotel instance with required properties
                    const hotelInstance = new Hotel_1.Hotel(hotel.id, hotel.clientId, Boolean(hotel.status), Number(hotel.rating) || 0, Number(hotel.price) || 0, hotel.name || '', hotel.branchName || '', hotel.contactNumber || '', hotel.contactPerson || '', hotel.country, hotel.city, hotel.address, hotel.description, hotel.commissionRate, hotel.contractStartDate, hotel.contractEndDate, hotel.generalAmenities, hotel.diningAmenities, hotel.wellnessAmenities, hotel.businessAmenities, hotel.otherAmenities, hotel.map, hotel.latitude ? parseFloat(hotel.latitude.toString()) : undefined, hotel.longitude ? parseFloat(hotel.longitude.toString()) : undefined, hotel.imageUrls, hotel.meals, hotel.unlimitedInternet, hotel.airportTransfer);
                    // Set arrays that are initialized in the constructor
                    hotelInstance.images = Array.isArray(hotel.images)
                        ? hotel.images.map(img => new HotelImage_1.HotelImage(img.id, img.hotelId || img.hotel_id, // Handle both cases for backward compatibility
                        img.path))
                        : [];
                    hotelInstance.amenities = Array.isArray(hotel.amenities)
                        ? hotel.amenities.map(amenity => new HotelAmenity_1.HotelAmenity(amenity.id, amenity.hotelId || amenity.hotel_id, // Handle both cases
                        amenity.name))
                        : [];
                    hotelInstance.ratings = Array.isArray(hotel.ratings)
                        ? hotel.ratings.map(rating => {
                            // Convert the rating to a number if it's a string
                            const ratingValue = typeof rating.rating === 'string'
                                ? parseFloat(rating.rating)
                                : Number(rating.rating);
                            return new HotelRating_1.HotelRating(rating.id, rating.hotelId || rating.hotel_id, // Handle both cases
                            rating.name || 'Anonymous', // Default name if not provided
                            rating.comment || '', ratingValue, [], // images array
                            rating.createdAt || rating.created_at ? new Date(rating.created_at) : undefined, rating.updatedAt || rating.updated_at ? new Date(rating.updated_at) : undefined);
                        })
                        : [];
                    return hotelInstance;
                }));
                // Calculate pagination metadata
                const page = filters.page || 1;
                const limit = filters.limit || 20;
                return {
                    data: processedHotels,
                    total,
                    page,
                    limit,
                };
            }
            catch (error) {
                console.error('Error in HotelService.listHotels:', error);
                throw new Error('فشل في استرجاع الفنادق. يرجى المحاولة مرة أخرى لاحقًا.');
            }
        });
    }
    createHotel(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const hotelRepo = manager.getRepository(Hotel_model_1.HotelEntity);
                const hotel = hotelRepo.create({
                    id,
                    clientId: dto.clientId,
                    status: (_a = dto.status) !== null && _a !== void 0 ? _a : true,
                    price: (_b = dto.price) !== null && _b !== void 0 ? _b : 0,
                    rating: (_c = dto.rating) !== null && _c !== void 0 ? _c : 0,
                    name: dto.name,
                    branchName: dto.branchName,
                    contactNumber: dto.contactNumber,
                    contactPerson: dto.contactPerson,
                    address: dto.address,
                    city: dto.city,
                    country: dto.country,
                    description: dto.description,
                    contractStartDate: dto.contractStartDate,
                    contractEndDate: dto.contractEndDate,
                    commission: (_d = dto.commissionRate) === null || _d === void 0 ? void 0 : _d.toString(),
                    generalAmenities: dto.generalAmenities,
                    diningAmenities: dto.diningAmenities,
                    wellnessAmenities: dto.wellnessAmenities,
                    businessAmenities: dto.businessAmenities,
                    otherAmenities: dto.otherAmenities,
                    map: dto.map,
                    latitude: dto.latitude != null ? dto.latitude.toString() : undefined,
                    longitude: dto.longitude != null ? dto.longitude.toString() : undefined,
                    imageUrls: dto.imageUrls,
                    meals: dto.meals,
                    unlimitedInternet: dto.unlimitedInternet,
                    airportTransfer: dto.airportTransfer
                });
                // ✅ save basic hotel
                yield hotelRepo.save(hotel);
                // ✅ now add hotel.images
                if (dto.images) {
                    console.log(`[createAirLine] Processing ${dto.images.length} images for AirLine ${id}`);
                    const imgRepo = manager.getRepository(HotelImage_model_1.HotelImageEntity);
                    for (const p of dto.images) {
                        const imageId = (0, uuid_1.v4)();
                        console.log(`[createAirLine] Creating image record with ID: ${imageId}, path: ${p}`);
                        const imgEnt = imgRepo.create({
                            id: imageId,
                            hotel_id: id,
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
                if (dto.ratings) {
                    const ratingRepo = manager.getRepository(HotelRating_model_1.HotelRatingEntity);
                    for (const comment of dto.ratings) {
                        yield ratingRepo.save({ id: (0, uuid_1.v4)(), hotel_id: id, comment });
                    }
                }
                // ✅ now add amenities
                const amenityRepo = manager.getRepository(HotelAmenity_model_1.HotelAmenityEntity);
                if (dto.amenities && dto.amenities.length > 0) {
                    const amenities = dto.amenities.map((name) => amenityRepo.create({ id: (0, uuid_1.v4)(), hotel_id: hotel.id, name }));
                    yield amenityRepo.save(amenities);
                }
            }));
            return this.loadFullHotel(id);
        });
    }
    updateHotel(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const hotelRepo = manager.getRepository(Hotel_model_1.HotelEntity);
                // ✅ تحديد الحقول القابلة للتحديث
                const entityFields = [
                    "name", "branchName", "clientId", "status", "price",
                    "contactNumber", "contactPerson", "address",
                    "city", "country", "description",
                    "contractStartDate", "contractEndDate",
                    "commission", "generalAmenities", "diningAmenities",
                    "wellnessAmenities", "businessAmenities", "otherAmenities",
                    "meals", "unlimitedInternet", "airportTransfer",
                    "ratings", "imageUrls", "latitude", "longitude"
                ];
                const updateData = {};
                for (const field of entityFields) {
                    if (field in dto) {
                        if (field === "latitude" || field === "longitude") {
                            const v = dto[field];
                            updateData[field] = v != null ? v.toString() : null;
                        }
                        else {
                            updateData[field] = dto[field];
                        }
                    }
                }
                // ✅ تحديث بيانات الفندق الأساسية
                if (Object.keys(updateData).length > 0) {
                    yield hotelRepo.update(id, updateData);
                }
                // ✅ الصور
                const imgRepo = manager.getRepository(HotelImage_model_1.HotelImageEntity);
                if (dto.newImages && dto.newImages.length > 0) {
                    // حذف الصور القديمة كلها
                    yield imgRepo.delete({ hotel_id: id });
                    // إضافة الصور الجديدة
                    const newImageEntities = dto.newImages.map((path) => ({
                        id: (0, uuid_1.v4)(),
                        hotel_id: id,
                        path,
                        createdAt: new Date(),
                    }));
                    yield imgRepo.save(newImageEntities);
                }
                // if (dto.ratings && Array.isArray(dto.ratings)) {
                //   const ratingRepo = manager.getRepository(HotelRatingEntity);
                //   // Clear existing ratings
                //   await ratingRepo.delete({ hotel_id: id });
                //   // Add new ratings
                //   for (const comment of dto.ratings) {
                //     await ratingRepo.save({ id: uuid(), hotel_id: id, comment });
                //   }
                // }
                // ✅ المرافق (amenities)
                if (dto.amenities) {
                    const amenityRepo = manager.getRepository(HotelAmenity_model_1.HotelAmenityEntity);
                    // حذف كل المرافق القديمة
                    yield amenityRepo.delete({ hotel_id: id });
                    // إضافة المرافق الجديدة
                    const newAmenityEntities = dto.amenities.map((name) => amenityRepo.create({ id: (0, uuid_1.v4)(), hotel_id: id, name }));
                    yield amenityRepo.save(newAmenityEntities);
                }
            }));
            return this.loadFullHotel(id);
        });
    }
    getHotel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const h = yield this.hotelRepo.findById(id);
            if (!h)
                throw new Error("Hotel not found");
            return h;
        });
    }
    deleteHotel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hotelRepo.delete(id);
        });
    }
    listImages(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource
                .getRepository(HotelImage_model_1.HotelImageEntity)
                .find({ where: { hotel_id: id }, order: { createdAt: "ASC" } });
        });
    }
    addRating(hotelId, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify flight exists
            const hotel = yield this.hotelRepo.getHotel(hotelId);
            if (!hotel) {
                throw new Error('Hotel not found');
            }
            // Ensure rating is a valid number between 1 and 5
            const ratingValue = Number(rating.rating);
            // if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
            //   throw new Error('Rating must be a number between 1 and 5');
            // }
            // Create the rating with validated values
            const hotelRating = new HotelRating_1.HotelRating((0, uuid_1.v4)(), // Generate a new ID
            hotelId, rating.name, rating.comment || '', // Use empty string for empty comments
            ratingValue, // Use the validated number
            rating.images || []);
            const result = yield this.ratingRepo.add(hotelId, hotelRating);
            // Recompute and persist overall rating as the average of all ratings
            const allRatings = yield this.ratingRepo.listForHotel(hotelId);
            if (allRatings && allRatings.length > 0) {
                const sum = allRatings.reduce((acc, r) => acc + Number(r.rating || 0), 0);
                const avg = Math.round((sum / allRatings.length) * 10) / 10; // one decimal place
                yield this.dataSource.getRepository(Hotel_model_1.HotelEntity).update(hotelId, { rating: avg });
            }
            else {
                yield this.dataSource.getRepository(Hotel_model_1.HotelEntity).update(hotelId, { rating: 0 });
            }
            return result;
        });
    }
    removeImage(hotelId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.getRepository(HotelImage_model_1.HotelImageEntity).delete(imageId);
            return this.listImages(hotelId);
        });
    }
    removeAmenity(hotelId, amenityId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.getRepository(HotelAmenity_model_1.HotelAmenityEntity).delete(amenityId);
        });
    }
    loadFullHotel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield this.hotelRepo.findById(id);
            if (!hotel)
                throw new Error("Hotel not found");
            if (!hotel.images || hotel.images.length === 0) {
                const imageEntities = yield this.dataSource
                    .getRepository(HotelImage_model_1.HotelImageEntity)
                    .find({
                    where: { hotel_id: id },
                    order: { createdAt: "ASC" },
                });
                hotel.images = imageEntities.map((img) => new HotelImage_1.HotelImage(img.id, img.hotel_id, img.path));
                if (!hotel.imageUrls || hotel.imageUrls.length === 0) {
                    hotel.imageUrls = hotel.images.map((img) => img.path);
                }
            }
            return hotel;
        });
    }
};
exports.HotelService = HotelService;
exports.HotelService = HotelService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.HotelRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.HotelRatingRepository)),
    __param(2, (0, inversify_1.inject)("DataSource")),
    __metadata("design:paramtypes", [Object, Object, typeorm_1.DataSource])
], HotelService);
