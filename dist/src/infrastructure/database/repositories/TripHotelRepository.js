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
exports.TripHotelRepository = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const database_config_1 = require("../../config/database.config");
const TripHotel_model_1 = require("../models/TripHotel.model");
const TripHotel_1 = require("../../../core/entities/TripHotel");
let TripHotelRepository = class TripHotelRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized)
            throw new Error("Data source not initialized");
        return database_config_1.AppDataSource.getRepository(TripHotel_model_1.TripHotelEntity);
    }
    listForTrip(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({ where: { trip_id: tripId } });
            return ents.map((e) => {
                var _a;
                const th = new TripHotel_1.TripHotel(e.id, e.trip_id, e.hotel_id);
                th.roomId = (_a = e.room_id) !== null && _a !== void 0 ? _a : null;
                return th;
            });
        });
    }
    add(tripId, hotelId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = this.repo.create({
                id: (0, uuid_1.v4)(),
                trip_id: tripId,
                hotel_id: hotelId,
                room_id: roomId !== null && roomId !== void 0 ? roomId : null,
            });
            yield this.repo.save(ent);
        });
    }
    removeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
};
exports.TripHotelRepository = TripHotelRepository;
exports.TripHotelRepository = TripHotelRepository = __decorate([
    (0, inversify_1.injectable)()
], TripHotelRepository);
