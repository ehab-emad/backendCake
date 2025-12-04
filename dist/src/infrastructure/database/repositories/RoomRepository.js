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
exports.RoomRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Room_model_1 = require("../models/Room.model");
const Room_1 = require("../../../core/entities/Room");
const RoomImage_1 = require("../../../core/entities/RoomImage");
const RoomAmenity_1 = require("../../../core/entities/RoomAmenity");
let RoomRepository = class RoomRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized)
            throw new Error("Data source not initialized");
        return database_config_1.AppDataSource.getRepository(Room_model_1.RoomEntity);
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo.findOne({
                where: { id },
                relations: ["images", "amenities"],
            });
            return ent ? this.toDomain(ent) : null;
        });
    }
    create(r) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(r));
        });
    }
    update(r) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(r));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    findAndCount(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let qb = this.repo
                .createQueryBuilder("r")
                .leftJoinAndSelect("r.images", "images")
                .leftJoinAndSelect("r.amenities", "amenities");
            if (filters.clientId) {
                qb = qb.where("r.client_id = :clientId", {
                    clientId: filters.clientId,
                });
            }
            if (filters.hotelId) {
                qb = filters.clientId
                    ? qb.andWhere("r.hotel_id = :hotelId", { hotelId: filters.hotelId })
                    : qb.where("r.hotel_id = :hotelId", { hotelId: filters.hotelId });
            }
            if (filters.status && filters.status !== "all") {
                const flag = filters.status === "active";
                qb = qb.andWhere("r.status = :flag", { flag });
            }
            if (filters.name) {
                qb = qb.andWhere("r.room_name LIKE :name", { name: `%${filters.name}%` });
            }
            const page = (_a = filters.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = filters.limit) !== null && _b !== void 0 ? _b : 20;
            qb = qb
                .orderBy("r.room_name", "ASC")
                .skip((page - 1) * limit)
                .take(limit);
            const [ents, total] = yield qb.getManyAndCount();
            return [ents.map((e) => this.toDomain(e)), total];
        });
    }
    toDomain(ent) {
        var _a, _b;
        return new Room_1.Room(ent.id, ent.client_id, ent.hotel_id, ent.status, ent.room_name, parseFloat(ent.price_per_night), parseFloat(ent.rating), ent.room_type, ent.room_category, ent.max_occupancy, ent.single_bed_count, ent.double_bed_count, ent.available_quantity, ent.available_rooms, ent.number_of_beds, ent.number_of_guests, ent.room_size, ent.view, ((_a = ent.images) === null || _a === void 0 ? void 0 : _a.map((i) => new RoomImage_1.RoomImage(i.id, i.room_id, i.path))) || [], ((_b = ent.amenities) === null || _b === void 0 ? void 0 : _b.map((a) => new RoomAmenity_1.RoomAmenity(a.id, a.room_id, a.name))) || [], ent.floor_type, ent.description, ent.created_at, ent.updated_at);
    }
    toEntity(r) {
        const ent = new Room_model_1.RoomEntity();
        Object.assign(ent, {
            id: r.id,
            client_id: r.clientId,
            hotel_id: r.hotelId,
            status: r.status,
            room_name: r.roomName,
            price_per_night: r.pricePerNight.toFixed(2),
            rating: r.rating.toFixed(2),
            room_type: r.roomType,
            room_category: r.room_category,
            max_occupancy: r.max_occupancy,
            single_bed_count: r.single_bed_count,
            double_bed_count: r.double_bed_count,
            available_quantity: r.available_quantity,
            available_rooms: r.availableRooms,
            number_of_beds: r.numberOfBeds,
            number_of_guests: r.numberOfGuests,
            room_size: r.roomSize,
            view: r.view,
            floor_type: r.floor_type,
            description: r.description,
            created_at: r.createdAt,
            updated_at: r.updatedAt
        });
        return ent;
    }
};
exports.RoomRepository = RoomRepository;
exports.RoomRepository = RoomRepository = __decorate([
    (0, inversify_1.injectable)()
], RoomRepository);
