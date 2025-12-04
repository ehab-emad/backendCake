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
exports.TripRatingRepository = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const database_config_1 = require("../../config/database.config");
const TripRating_1 = require("../../../core/entities/TripRating");
const TripRating_model_1 = require("../models/TripRating.model");
let TripRatingRepository = class TripRatingRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized) {
            throw new Error("Data source is not initialized");
        }
        return database_config_1.AppDataSource.getRepository(TripRating_model_1.TripRatingEntity);
    }
    listForTrip(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({ where: { trip_id: tripId }, order: { created_at: "DESC" } });
            return ents.map((e) => new TripRating_1.TripRating(e.id, e.trip_id, e.name, e.comment || undefined, Number(e.rating), e.images || [], e.created_at, e.updated_at));
        });
    }
    add(tripId, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = new TripRating_model_1.TripRatingEntity();
            ent.id = rating.id || (0, uuid_1.v4)();
            ent.trip_id = tripId;
            ent.name = rating.name;
            const r = Number(rating.rating);
            if (isNaN(r) || r < 1 || r > 5)
                throw new Error("Rating must be a number between 1 and 5");
            ent.rating = r;
            ent.comment = rating.comment !== undefined && rating.comment !== '' ? rating.comment : null;
            ent.images = Array.isArray(rating.images) ? rating.images : [];
            ent.created_at = rating.createdAt || new Date();
            ent.updated_at = rating.updatedAt || new Date();
            const saved = yield this.repo.save(ent);
            return new TripRating_1.TripRating(saved.id, saved.trip_id, saved.name, saved.comment || undefined, Number(saved.rating), saved.images || [], saved.created_at, saved.updated_at);
        });
    }
    removeById(ratingId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(ratingId);
        });
    }
    remove(tripId, ratingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rating = yield this.repo.findOne({ where: { id: ratingId, trip_id: tripId } });
            if (!rating)
                throw new Error("Rating not found for this trip");
            yield this.repo.delete(ratingId);
        });
    }
};
exports.TripRatingRepository = TripRatingRepository;
exports.TripRatingRepository = TripRatingRepository = __decorate([
    (0, inversify_1.injectable)()
], TripRatingRepository);
