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
exports.RoomAmenityRepository = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const database_config_1 = require("../../config/database.config");
const RoomAmenity_model_1 = require("../models/RoomAmenity.model");
const RoomAmenity_1 = require("../../../core/entities/RoomAmenity");
let RoomAmenityRepository = class RoomAmenityRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized) {
            throw new Error("Data source is not initialized");
        }
        return database_config_1.AppDataSource.getRepository(RoomAmenity_model_1.RoomAmenityEntity);
    }
    listForRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({
                where: { room_id: roomId },
                order: { createdAt: "ASC" },
            });
            return ents.map((e) => new RoomAmenity_1.RoomAmenity(e.id, e.room_id, e.name));
        });
    }
    add(roomId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = this.repo.create({ id: (0, uuid_1.v4)(), room_id: roomId, name });
            const saved = yield this.repo.save(ent);
            return new RoomAmenity_1.RoomAmenity(saved.id, saved.room_id, saved.name);
        });
    }
    removeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
};
exports.RoomAmenityRepository = RoomAmenityRepository;
exports.RoomAmenityRepository = RoomAmenityRepository = __decorate([
    (0, inversify_1.injectable)()
], RoomAmenityRepository);
