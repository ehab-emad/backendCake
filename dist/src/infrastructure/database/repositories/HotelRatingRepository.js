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
exports.HotelRatingRepository = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const database_config_1 = require("../../config/database.config");
const HotelRating_1 = require("../../../core/entities/HotelRating");
const HotelRating_model_1 = require("../models/HotelRating.model");
let HotelRatingRepository = class HotelRatingRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized) {
            throw new Error("Data source is not initialized");
        }
        return database_config_1.AppDataSource.getRepository(HotelRating_model_1.HotelRatingEntity);
    }
    listForHotel(hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({
                where: { hotel_id: hotelId },
                order: { created_at: "DESC" }, // ممكن تعمل ترتيب مثلاً حسب تاريخ الإنشاء
            });
            return ents.map((e) => new HotelRating_1.HotelRating(e.id, e.hotel_id, e.name, e.comment || undefined, // Convert null to undefined
            e.rating, e.images || [], e.created_at, e.updated_at));
        });
    }
    add(hotelId, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a new entity instance
            const ent = new HotelRating_model_1.HotelRatingEntity();
            ent.id = rating.id || (0, uuid_1.v4)();
            ent.hotel_id = hotelId;
            ent.name = rating.name;
            ent.comment = rating.comment !== undefined && rating.comment !== '' ? rating.comment : null;
            // Ensure rating is a valid number
            const ratingValue = Number(rating.rating);
            if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
                throw new Error('Rating must be a number between 1 and 5');
            }
            ent.rating = ratingValue;
            ent.images = Array.isArray(rating.images) ? rating.images : [];
            ent.created_at = rating.createdAt || new Date();
            ent.updated_at = rating.updatedAt || new Date();
            // Save the entity
            const saved = yield this.repo.save(ent);
            // Return a new HotelRating instance with the saved data
            return new HotelRating_1.HotelRating(saved.id, saved.hotel_id, saved.name, saved.comment || undefined, // Ensure consistent type (string | undefined)
            saved.rating, saved.images || [], saved.created_at, saved.updated_at);
        });
    }
    removeById(ratingId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(ratingId);
        });
    }
    remove(hotelId, ratingId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify the rating belongs to the flight
            const rating = yield this.repo.findOne({
                where: {
                    id: ratingId,
                    hotel_id: hotelId
                }
            });
            if (!rating) {
                throw new Error('Rating not found for this hotel');
            }
            yield this.repo.delete(ratingId);
        });
    }
};
exports.HotelRatingRepository = HotelRatingRepository;
exports.HotelRatingRepository = HotelRatingRepository = __decorate([
    (0, inversify_1.injectable)()
], HotelRatingRepository);
