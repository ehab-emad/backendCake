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
exports.TripService = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const Trip_model_1 = require("../../infrastructure/database/models/Trip.model");
const TripSchedule_model_1 = require("../../infrastructure/database/models/TripSchedule.model");
const TripImage_model_1 = require("../../infrastructure/database/models/TripImage.model");
const TripHotel_model_1 = require("../../infrastructure/database/models/TripHotel.model");
const TripFlight_model_1 = require("../../infrastructure/database/models/TripFlight.model");
const types_1 = require("../../shared/di/types");
const TripRating_1 = require("../../core/entities/TripRating");
let TripService = class TripService {
    constructor(tripRepo, schedRepo, imgRepo, hotelLinkRepo, flightLinkRepo, hotelRepo, ratingRepo, ds) {
        this.tripRepo = tripRepo;
        this.schedRepo = schedRepo;
        this.imgRepo = imgRepo;
        this.hotelLinkRepo = hotelLinkRepo;
        this.flightLinkRepo = flightLinkRepo;
        this.hotelRepo = hotelRepo;
        this.ratingRepo = ratingRepo;
        this.ds = ds;
    }
    addRating(tripId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            // verify trip exists
            const trip = yield this.tripRepo.findById(tripId);
            if (!trip)
                throw new Error('Trip not found');
            const tripRating = new TripRating_1.TripRating((0, uuid_1.v4)(), tripId, input.name, input.comment || '', Number(input.rating), input.images || []);
            const result = yield this.ratingRepo.add(tripId, tripRating);
            // Recompute and persist overall rating as the average of all ratings
            const allRatings = yield this.ratingRepo.listForTrip(tripId);
            if (allRatings && allRatings.length > 0) {
                const sum = allRatings.reduce((acc, r) => acc + Number(r.rating || 0), 0);
                const avg = Math.round((sum / allRatings.length) * 10) / 10; // one decimal place
                yield this.ds.getRepository(Trip_model_1.TripEntity).update(tripId, { rating: avg });
            }
            else {
                yield this.ds.getRepository(Trip_model_1.TripEntity).update(tripId, { rating: 0 });
            }
            return result;
        });
    }
    createTrip(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate images before proceeding
            if (!dto.images || dto.images.length < 5) {
                throw new Error('يجب إضافة 5 صور على الأقل');
            }
            const id = (0, uuid_1.v4)();
            yield this.ds.transaction((m) => __awaiter(this, void 0, void 0, function* () {
                const te = m.getRepository(Trip_model_1.TripEntity);
                // Create the entity first with current timestamps
                const now = new Date();
                const trip = te.create({
                    id,
                    client_id: dto.clientId,
                    status: dto.status,
                    name: dto.name,
                    rating: dto.rating || 0,
                    departure: dto.departure,
                    arrival: dto.arrival,
                    trip_duration: dto.tripDuration,
                    includes_hotel: dto.includesHotel,
                    includes_flight: dto.includesFlight,
                    description: dto.description || '',
                    includeProgram: dto.includeProgram || [],
                    noIncludeProgram: dto.noIncludeProgram || [],
                    price: dto.price || 0,
                    days: dto.days || 1,
                    departure_date: dto.departureDate || new Date(),
                    return_date: dto.returnDate || new Date(),
                    created_at: now,
                    updated_at: now
                });
                // Set the ID and save
                trip.id = id;
                yield te.save(trip);
                if (dto.schedule) {
                    const re = m.getRepository(TripSchedule_model_1.TripScheduleEntity);
                    for (const item of dto.schedule) {
                        yield re.save(re.create({
                            id,
                            trip_id: id,
                            day: item.day,
                            title: item.title,
                            description: item.description,
                        }));
                    }
                }
                if (dto.images) {
                    const ie = m.getRepository(TripImage_model_1.TripImageEntity);
                    for (const path of dto.images) {
                        yield ie.save(ie.create({ id: (0, uuid_1.v4)(), trip_id: id, path }));
                    }
                }
                if (dto.hotels) {
                    const he = m.getRepository(TripHotel_model_1.TripHotelEntity);
                    for (const hotelId of dto.hotels) {
                        // Check if hotel exists
                        const hotelExists = yield this.hotelRepo.exists(hotelId);
                        if (!hotelExists) {
                            throw new Error(`Hotel with ID ${hotelId} does not exist`);
                        }
                        yield he.save(he.create({ id: (0, uuid_1.v4)(), trip_id: id, hotel_id: hotelId }));
                    }
                }
                if (dto.flights) {
                    const fe = m.getRepository(TripFlight_model_1.TripFlightEntity);
                    for (const flightId of dto.flights) {
                        yield fe.save(fe.create({ id: (0, uuid_1.v4)(), trip_id: id, flight_id: flightId }));
                    }
                }
            }));
            const created = yield this.tripRepo.findById(id);
            if (!created)
                throw new Error("Trip creation failed");
            return created;
        });
    }
    listTrips(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get paginated and filtered trips from repository
                const [trips, total] = yield this.tripRepo.findAndCount(filters);
                // Load additional data for each trip in parallel
                const tripsWithRelations = yield Promise.all(trips.map((trip) => __awaiter(this, void 0, void 0, function* () {
                    // Load ratings for the trip
                    const ratings = yield this.ratingRepo.listForTrip(trip.id);
                    // Convert to proper Trip object with all relations
                    return Object.assign(Object.assign({}, trip), { ratings, 
                        // Ensure numeric fields are properly typed
                        rating: Number(trip.rating) || 0, price: Number(trip.price) || 0, 
                        // Ensure boolean fields
                        status: Boolean(trip.status), includesHotel: Boolean(trip.includesHotel), includesFlight: Boolean(trip.includesFlight) });
                })));
                // Calculate pagination metadata
                const page = filters.page || 1;
                const limit = filters.limit || 20;
                return {
                    data: tripsWithRelations,
                    total,
                    page,
                    limit,
                };
            }
            catch (error) {
                console.error('Error in TripService.listTrips:', error);
                throw new Error('فشل في استرجاع الرحلات. يرجى المحاولة مرة أخرى لاحقًا.');
            }
        });
    }
    getTrip(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield this.tripRepo.findById(id);
            if (!t)
                throw new Error("Trip not found");
            // load ratings
            t.ratings = yield this.ratingRepo.listForTrip(id);
            return t;
        });
    }
    updateTrip(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            yield this.ds.transaction((m) => __awaiter(this, void 0, void 0, function* () {
                const te = m.getRepository(Trip_model_1.TripEntity);
                const trip = yield te.findOneOrFail({ where: { id } });
                // Preserve the original created_at timestamp
                const createdAt = trip.created_at;
                yield te.update(id, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (dto.clientId !== undefined && { client_id: dto.clientId })), (dto.status !== undefined && { status: dto.status })), (dto.name !== undefined && { name: dto.name })), (dto.rating !== undefined && { rating: dto.rating })), (dto.departure !== undefined && { departure: dto.departure })), (dto.arrival !== undefined && { arrival: dto.arrival })), (dto.tripDuration !== undefined && { trip_duration: dto.tripDuration })), (dto.includesHotel !== undefined && { includes_hotel: dto.includesHotel })), (dto.includesFlight !== undefined && { includes_flight: dto.includesFlight })), (dto.description !== undefined && { description: dto.description })), (dto.includeProgram !== undefined && { includeProgram: dto.includeProgram })), (dto.noIncludeProgram !== undefined && { noIncludeProgram: dto.noIncludeProgram })), (dto.price !== undefined && { price: dto.price })), (dto.days !== undefined && { days: dto.days })), (dto.departureDate !== undefined && { departure_date: dto.departureDate })), (dto.returnDate !== undefined && { return_date: dto.returnDate })), { created_at: createdAt, updated_at: now }));
                if (dto.schedule) {
                    const re = m.getRepository(TripSchedule_model_1.TripScheduleEntity);
                    // If schedule is provided, replace all existing schedules
                    yield re.delete({ trip_id: id });
                    for (const item of dto.schedule) {
                        yield re.save(re.create({
                            id: (0, uuid_1.v4)(),
                            trip_id: id,
                            day: item.day,
                            title: item.title,
                            description: item.description,
                        }));
                    }
                }
                if (dto.newSchedule) {
                    const re = m.getRepository(TripSchedule_model_1.TripScheduleEntity);
                    // If newSchedule is provided, add only the new items (don't delete existing)
                    for (const item of dto.newSchedule) {
                        yield re.save(re.create({
                            id: (0, uuid_1.v4)(),
                            trip_id: id,
                            day: item.day,
                            title: item.title,
                            description: item.description,
                        }));
                    }
                }
                if (dto.newImages && dto.newImages.length > 0) {
                    const imgRepo = m.getRepository(TripImage_model_1.TripImageEntity);
                    // Add new images without deleting existing ones
                    const newImages = dto.newImages.map((path) => ({
                        id: (0, uuid_1.v4)(),
                        trip_id: id,
                        path,
                        createdAt: new Date(),
                    }));
                    yield imgRepo.save(newImages);
                }
                if (dto.newHotels) {
                    const he = m.getRepository(TripHotel_model_1.TripHotelEntity);
                    for (const hotelId of dto.newHotels) {
                        // Check if hotel exists
                        const hotelExists = yield this.hotelRepo.exists(hotelId);
                        if (!hotelExists) {
                            throw new Error(`Hotel with ID ${hotelId} does not exist`);
                        }
                        yield he.save(he.create({ id: (0, uuid_1.v4)(), trip_id: id, hotel_id: hotelId }));
                    }
                }
                if (dto.newFlights) {
                    const fe = m.getRepository(TripFlight_model_1.TripFlightEntity);
                    for (const flightId of dto.newFlights) {
                        yield fe.save(fe.create({ id: (0, uuid_1.v4)(), trip_id: id, flight_id: flightId }));
                    }
                }
                if (dto.flights) {
                    const fe = m.getRepository(TripFlight_model_1.TripFlightEntity);
                    // If flights is provided, replace all existing flights
                    yield fe.delete({ trip_id: id });
                    for (const flightId of dto.flights) {
                        yield fe.save(fe.create({ id: (0, uuid_1.v4)(), trip_id: id, flight_id: flightId }));
                    }
                }
            }));
            const updated = yield this.tripRepo.findById(id);
            if (!updated)
                throw new Error("Trip update failed");
            return updated;
        });
    }
    deleteTrip(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tripRepo.delete(id);
        });
    }
    removeSchedule(tripId, schedId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.schedRepo.removeById(schedId);
        });
    }
    removeImage(tripId, imgId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.imgRepo.removeById(imgId);
        });
    }
    removeHotel(tripId, linkId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hotelLinkRepo.removeById(linkId);
        });
    }
    removeFlight(tripId, linkId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.flightLinkRepo.removeById(linkId);
        });
    }
    // async addRating(tripId: string, input: { name: string; comment?: string; rating: number; images?: string[] }): Promise<TripRating> {
    //   // verify trip exists
    //   const trip = await this.tripRepo.findById(tripId);
    //   if (!trip) throw new Error('Trip not found');
    //   const ratingValue = Number(input.rating);
    //   if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    //     throw new Error('Rating must be a number between 1 and 5');
    //   }
    //   const tr = new TripRating(
    //     uuid(),
    //     tripId,
    //     input.name,
    //     input.comment || '',
    //     ratingValue,
    //     input.images || []
    //   );
    //   return this.ratingRepo.add(tripId, tr);
    // }
    removeRating(tripId, ratingId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ratingRepo.remove(tripId, ratingId);
        });
    }
};
exports.TripService = TripService;
exports.TripService = TripService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TripRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TripScheduleRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.TripImageRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.TripHotelRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.TripFlightRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.HotelRepository)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.TripRatingRepository)),
    __param(7, (0, inversify_1.inject)("DataSource")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, typeorm_1.DataSource])
], TripService);
