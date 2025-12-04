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
exports.TripRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Trip_model_1 = require("../models/Trip.model");
const Trip_1 = require("../../../core/entities/Trip");
const TripSchedule_1 = require("../../../core/entities/TripSchedule");
const TripImage_1 = require("../../../core/entities/TripImage");
const TripHotel_1 = require("../../../core/entities/TripHotel");
const TripFlight_1 = require("../../../core/entities/TripFlight");
let TripRepository = class TripRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized)
            throw new Error("DS not initialized");
        return database_config_1.AppDataSource.getRepository(Trip_model_1.TripEntity);
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo.findOne({
                where: { id },
                relations: ["schedule", "images", "hotels", "flights"],
            });
            if (!ent)
                return null;
            return this.toDomain(ent);
        });
    }
    findAndCount(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            let qb = this.repo
                .createQueryBuilder("t")
                .leftJoinAndSelect("t.schedule", "schedule")
                .leftJoinAndSelect("t.images", "images")
                .leftJoinAndSelect("t.hotels", "hotels")
                .leftJoinAndSelect("t.flights", "flights");
            // Apply client filter
            if (filters.clientId) {
                qb = qb.where("t.clientId = :clientId", { clientId: filters.clientId });
            }
            // Apply status filter
            if (filters.status && filters.status !== "all") {
                qb = qb.andWhere("t.status = :status", { status: filters.status === "active" });
            }
            // Apply search by name
            // Apply search by name (search in departure and arrival fields)
            if (filters.name) {
                qb = qb.andWhere("LOWER(t.departure) LIKE :name OR LOWER(t.arrival) LIKE :name", { name: `%${filters.name.toLowerCase()}%` });
            }
            // Apply arrival date filter
            if (filters.arrivalDate) {
                qb = qb.andWhere("DATE(t.arrival) = :arrivalDate", {
                    arrivalDate: filters.arrivalDate
                });
            }
            // Apply creation month/year filter
            if (filters.createdAtMonth && filters.createdAtYear) {
                qb = qb.andWhere("EXTRACT(MONTH FROM t.createdAt) = :month AND EXTRACT(YEAR FROM t.createdAt) = :year", {
                    month: filters.createdAtMonth,
                    year: filters.createdAtYear
                });
            }
            // Apply trip filters for arrival city and month
            if (filters.arrivalCity || filters.month) {
                // Filter by arrival city (case-insensitive partial match)
                if (filters.arrivalCity) {
                    qb = qb.andWhere("LOWER(t.arrivalCity) LIKE :arrivalCity", {
                        arrivalCity: `%${filters.arrivalCity.toLowerCase()}%`
                    });
                }
                // Filter by month if provided
                if (filters.month) {
                    qb = qb.andWhere("EXTRACT(MONTH FROM t.createdAt) = :month", {
                        month: filters.month
                    });
                }
            }
            // For backward compatibility with createdAtMonth
            else if (filters.createdAtMonth) {
                qb = qb.andWhere("EXTRACT(MONTH FROM t.createdAt) = :month", {
                    month: filters.createdAtMonth
                });
            }
            // Apply flight filters if needed (departure city or flight date)
            if (filters.departureCity || filters.flightDate) {
                // Join with flights and flight details if not already joined
                if (!qb.expressionMap.joinAttributes.some(join => join.relation && join.relation.propertyPath === 'flights')) {
                    qb = qb.leftJoinAndSelect("t.flights", "tripFlights");
                    qb = qb.leftJoinAndSelect("tripFlights.flight", "flight");
                }
                // Apply departure city filter for flights
                if (filters.departureCity) {
                    qb = qb.andWhere("LOWER(flight.departure_city) LIKE :departureCity", {
                        departureCity: `%${filters.departureCity.toLowerCase()}%`
                    });
                }
                // Apply flight date filter
                if (filters.flightDate) {
                    qb = qb.andWhere("DATE(flight.departure_time) = :flightDate", {
                        flightDate: filters.flightDate
                    });
                }
            }
            // Apply rating filters
            if (filters.minRating !== undefined) {
                qb = qb.andWhere("t.rating >= :minRating", { minRating: filters.minRating });
            }
            if (filters.maxRating !== undefined) {
                qb = qb.andWhere("t.rating <= :maxRating", { maxRating: filters.maxRating });
            }
            // Apply price filters
            if (filters.minPrice !== undefined) {
                qb = qb.andWhere("t.price >= :minPrice", { minPrice: filters.minPrice });
            }
            if (filters.maxPrice !== undefined) {
                qb = qb.andWhere("t.price <= :maxPrice", { maxPrice: filters.maxPrice });
            }
            // Get total count with current filters before applying pagination
            const totalCount = yield qb.getCount();
            // Apply sorting
            if (filters.sortBy) {
                const orderDirection = (filters.sortOrder || 'asc').toUpperCase();
                switch (filters.sortBy) {
                    case 'price':
                        qb = qb.orderBy("t.price", orderDirection);
                        break;
                    case 'rating':
                        qb = qb.orderBy("t.rating", orderDirection);
                        break;
                    case 'startDate':
                        qb = qb.orderBy("t.departure", orderDirection);
                        break;
                    default:
                        qb = qb.orderBy("t.created_at", "DESC");
                }
            }
            else {
                // Default sorting
                qb = qb.orderBy("t.created_at", "DESC");
            }
            // Apply pagination
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            qb = qb.skip((page - 1) * limit).take(limit);
            const ents = yield qb.getMany();
            return [ents.map((e) => this.toDomain(e)), totalCount];
        });
    }
    countCreatedBetween(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo
                .createQueryBuilder("t")
                .where("t.created_at BETWEEN :start AND :end", { start, end })
                .getCount();
        });
    }
    create(t) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(t));
        });
    }
    update(t) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(t));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    toDomain(ent) {
        // Map schedule items first
        const schedule = (ent.schedule || []).map((s) => new TripSchedule_1.TripSchedule(s.id, s.trip_id, s.day, s.title, s.description));
        // Map other related entities
        const images = (ent.images || []).map((i) => new TripImage_1.TripImage(i.id, i.trip_id, i.path));
        const hotels = (ent.hotels || []).map((h) => new TripHotel_1.TripHotel(h.id, h.trip_id, h.hotel_id));
        const flights = (ent.flights || []).map((f) => new TripFlight_1.TripFlight(f.id, f.trip_id, f.flight_id));
        // Create the trip with all fields
        const trip = new Trip_1.Trip(ent.id, ent.client_id, ent.status, ent.name || '', // Add name field with fallback to empty string
        ent.departure, ent.arrival, ent.trip_duration, ent.includes_hotel, ent.includes_flight, typeof ent.rating === 'string' ? parseFloat(ent.rating) : (ent.rating || 0), typeof ent.description === 'string' ? ent.description : '', ent.includeProgram || [], ent.noIncludeProgram || [], ent.price ? parseFloat(ent.price.toString()) : 0, ent.days || 1, ent.departure_date || new Date(), ent.return_date || new Date(), schedule, images, hotels, flights, [], ent.created_at, ent.updated_at);
        return trip;
    }
    toEntity(t) {
        const ent = new Trip_model_1.TripEntity();
        Object.assign(ent, {
            id: t.id,
            client_id: t.clientId,
            status: t.status,
            name: t.name,
            departure: t.departure,
            arrival: t.arrival,
            trip_duration: t.tripDuration,
            includes_hotel: t.includesHotel,
            includes_flight: t.includesFlight,
            rating: typeof t.rating === 'string' ? parseFloat(t.rating) : (t.rating || 0),
            description: t.description || '',
            includeProgram: t.includeProgram || [],
            noIncludeProgram: t.noIncludeProgram || [],
            price: t.price || 0,
            days: t.days || 1,
            departure_date: t.departureDate || new Date(),
            return_date: t.returnDate || new Date(),
            created_at: t.createdAt,
            updated_at: t.updatedAt
        });
        return ent;
    }
};
exports.TripRepository = TripRepository;
exports.TripRepository = TripRepository = __decorate([
    (0, inversify_1.injectable)()
], TripRepository);
