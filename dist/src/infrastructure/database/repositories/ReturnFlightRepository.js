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
exports.ReturnFlightRepository = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const database_config_1 = require("../../config/database.config");
const ReturnFlight_1 = require("../../../core/entities/ReturnFlight");
const ReturnFlight_model_1 = require("../models/ReturnFlight.model");
let ReturnFlightRepository = class ReturnFlightRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized) {
            throw new Error("Data source is not initialized");
        }
        return database_config_1.AppDataSource.getRepository(ReturnFlight_model_1.ReturnFlightEntity);
    }
    listForFlight(flightId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({
                where: { flightId },
                order: { departureTime: "ASC" },
                relations: ["airlineRelation"],
            });
            return ents.map(this.mapToDomain);
        });
    }
    mapToDomain(entity) {
        if (!entity) {
            throw new Error("ReturnFlightEntity is undefined or null in mapToDomain");
        }
        return new ReturnFlight_1.ReturnFlight(entity.id, entity.flightId, entity.departureCity, entity.arrivalCity, entity.departureIata, entity.arrivalIata, entity.departureTime, entity.arrivalTime, entity.duration, entity.status, entity.airlineId, entity.clientId, entity.name, entity.seats, entity.rating, entity.flightNumber, entity.price, entity.currency, entity.numberOfStops, entity.availableSeats, entity.aircraftType, entity.aircraftImage, entity.seatLayout, entity.seatPitch, entity.createdAt, entity.updatedAt);
    }
    add(flightId, returnFlight) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const ent = this.repo.create(Object.assign(Object.assign({}, returnFlight), { id: returnFlight.id || (0, uuid_1.v4)(), flightId, status: (_a = returnFlight.status) !== null && _a !== void 0 ? _a : true, createdAt: returnFlight.createdAt || new Date(), updatedAt: new Date() }));
            const saved = yield this.repo.save(ent);
            return this.mapToDomain(saved);
        });
    }
    removeById(returnFlightId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(returnFlightId);
        });
    }
    findById(returnFlightId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.repo.findOne({
                where: { id: returnFlightId },
                relations: ["airlineRelation"],
            });
            return entity ? this.mapToDomain(entity) : null;
        });
    }
    update(returnFlight) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.repo.findOne({ where: { id: returnFlight.id } });
            if (!existing)
                throw new Error("Return flight not found");
            Object.assign(existing, Object.assign(Object.assign({}, returnFlight), { updatedAt: new Date() }));
            const updated = yield this.repo.save(existing);
            return this.mapToDomain(updated);
        });
    }
};
exports.ReturnFlightRepository = ReturnFlightRepository;
exports.ReturnFlightRepository = ReturnFlightRepository = __decorate([
    (0, inversify_1.injectable)()
], ReturnFlightRepository);
