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
exports.RoomService = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const Room_model_1 = require("../../infrastructure/database/models/Room.model");
const RoomImage_model_1 = require("../../infrastructure/database/models/RoomImage.model");
const RoomAmenity_model_1 = require("../../infrastructure/database/models/RoomAmenity.model");
const types_1 = require("../../shared/di/types");
let RoomService = class RoomService {
    constructor(roomRepo, imageRepo, amenityRepo, dataSource) {
        this.roomRepo = roomRepo;
        this.imageRepo = imageRepo;
        this.amenityRepo = amenityRepo;
        this.dataSource = dataSource;
    }
    createRoom(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const rRepo = manager.getRepository(Room_model_1.RoomEntity);
                const partial = {
                    id,
                    client_id: dto.clientId,
                    hotel_id: dto.hotelId,
                    status: dto.status,
                    room_name: dto.roomName,
                    price_per_night: dto.pricePerNight.toFixed(2),
                    rating: dto.rating.toFixed(2),
                    room_type: dto.roomType,
                    room_category: dto.room_category,
                    max_occupancy: dto.max_occupancy,
                    single_bed_count: dto.single_bed_count,
                    double_bed_count: dto.double_bed_count,
                    available_quantity: dto.available_quantity,
                    available_rooms: dto.availableRooms,
                    number_of_beds: dto.numberOfBeds,
                    number_of_guests: dto.numberOfGuests,
                    room_size: dto.roomSize,
                    view: dto.view,
                    floor_type: dto.floor_type,
                    description: dto.description,
                };
                yield rRepo.save(partial);
                if (dto.images) {
                    const imgRepo = manager.getRepository(RoomImage_model_1.RoomImageEntity);
                    for (const path of dto.images) {
                        yield imgRepo.save({
                            id: (0, uuid_1.v4)(),
                            room_id: id,
                            path,
                        });
                    }
                }
                if (dto.amenities) {
                    const amRepo = manager.getRepository(RoomAmenity_model_1.RoomAmenityEntity);
                    for (const name of dto.amenities) {
                        yield amRepo.save({
                            id: (0, uuid_1.v4)(),
                            room_id: id,
                            name,
                        });
                    }
                }
            }));
            const created = yield this.roomRepo.findById(id);
            if (!created)
                throw new Error("Failed to load room after creation");
            return created;
        });
    }
    updateRoom(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const rRepo = manager.getRepository(Room_model_1.RoomEntity);
                const imgRepo = manager.getRepository(RoomImage_model_1.RoomImageEntity);
                const amRepo = manager.getRepository(RoomAmenity_model_1.RoomAmenityEntity);
                // Update fields dynamically
                const fields = [
                    "status", "room_name", "price_per_night", "rating",
                    "room_type", "room_category", "max_occupancy",
                    "single_bed_count", "double_bed_count", "available_quantity",
                    "floor_type", "description", "available_rooms", "number_of_beds",
                    "number_of_guests", "room_size", "view"
                ];
                const updateData = {};
                for (const field of fields) {
                    const camelCaseField = field.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
                    if (dto[camelCaseField] !== undefined) {
                        const value = dto[camelCaseField];
                        updateData[field] = typeof value === "number" ? Number(value) : value;
                    }
                }
                if (Object.keys(updateData).length > 0) {
                    yield rRepo.update(id, updateData);
                }
                // ✅ استبدال الصور بالكامل لو تم إرسال صور جديدة
                if (dto.newImages && dto.newImages.length > 0) {
                    yield imgRepo.delete({ room_id: id });
                    const newImages = dto.newImages.map((path) => ({
                        id: (0, uuid_1.v4)(),
                        room_id: id,
                        path,
                        createdAt: new Date(),
                    }));
                    yield imgRepo.save(newImages);
                }
                // ✅ استبدال المرافق بالكامل لو تم إرسال مرافق جديدة
                if (dto.newAmenities && dto.newAmenities.length > 0) {
                    yield amRepo.delete({ room_id: id });
                    const newAmenities = dto.newAmenities.map((name) => ({
                        id: (0, uuid_1.v4)(),
                        room_id: id,
                        name,
                    }));
                    yield amRepo.save(newAmenities);
                }
            }));
            // ✅ تحميل الغرفة المحدثة
            return this.getRoom(id);
        });
    }
    deleteRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomRepo.delete(id);
        });
    }
    removeImage(roomId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.imageRepo.removeById(imageId);
        });
    }
    removeAmenity(roomId, amenityId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.amenityRepo.removeById(amenityId);
        });
    }
    listRooms(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const [data, total] = yield this.roomRepo.findAndCount(filters);
            return {
                data,
                total,
                page: (_a = filters.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = filters.limit) !== null && _b !== void 0 ? _b : 20,
            };
        });
    }
    getRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.roomRepo.findById(id);
            if (!r)
                throw new Error("Room not found");
            return r;
        });
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.RoomRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.RoomImageRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.RoomAmenityRepository)),
    __param(3, (0, inversify_1.inject)("DataSource")),
    __metadata("design:paramtypes", [Object, Object, Object, typeorm_1.DataSource])
], RoomService);
