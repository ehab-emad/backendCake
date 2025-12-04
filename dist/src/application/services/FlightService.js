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
exports.FlightService = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const Flight_model_1 = require("../../infrastructure/database/models/Flight.model");
const FlightRating_model_1 = require("../../infrastructure/database/models/FlightRating.model");
const FlightBaggage_model_1 = require("../../infrastructure/database/models/FlightBaggage.model");
const TransitFlight_model_1 = require("../../infrastructure/database/models/TransitFlight.model");
const FlightAmenities_model_1 = require("../../infrastructure/database/models/FlightAmenities.model");
const FlightMeals_model_1 = require("../../infrastructure/database/models/FlightMeals.model");
const FlightRating_1 = require("../../core/entities/FlightRating");
const types_1 = require("../../shared/di/types");
const TransitFlight_1 = require("../../core/entities/TransitFlight");
const ReturnFlight_model_1 = require("../../infrastructure/database/models/ReturnFlight.model");
const ReturnFlight_1 = require("../../core/entities/ReturnFlight");
let FlightService = class FlightService {
    constructor(flightRepo, baggageRepo, amenityRepo, mealRepo, ratingRepo, transitFlightRepo, returnFlightRepo, dataSource) {
        this.flightRepo = flightRepo;
        this.baggageRepo = baggageRepo;
        this.amenityRepo = amenityRepo;
        this.mealRepo = mealRepo;
        this.ratingRepo = ratingRepo;
        this.transitFlightRepo = transitFlightRepo;
        this.returnFlightRepo = returnFlightRepo;
        this.dataSource = dataSource;
    }
    /**
     * Updates the booking status of specified seats for a flight
     * @param flightId The ID of the flight
     * @param seatNumbers Array of seat numbers to update
     * @param isBooked Whether to mark seats as booked (true) or available (false)
     */
    updateSeatsStatus(flightId, seatNumbers, isBooked) {
        return __awaiter(this, void 0, void 0, function* () {
            const flight = yield this.flightRepo.findById(flightId);
            if (!flight) {
                throw new Error('Flight not found');
            }
            // Update seat status
            if (flight.seats) {
                flight.seats = flight.seats.map(seat => {
                    if (seatNumbers.includes(seat.number)) {
                        return Object.assign(Object.assign({}, seat), { isBooking: isBooked });
                    }
                    return seat;
                });
                // Save the updated flight
                yield this.flightRepo.update(flight);
            }
        });
    }
    updateTransitSeatsStatus(flightId, seatNumbers, isBooked) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const flight = yield this.flightRepo.findById(flightId);
            if (!flight)
                throw new Error("Flight not found");
            // جلب الرحلات المرتبطة وتهيئة الـ seats
            flight.transitFlights = (yield this.transitFlightRepo.listForFlight(flightId))
                .map(tf => (Object.assign(Object.assign({}, tf), { seats: tf.seats || [] })));
            flight.returnFlights = (yield this.returnFlightRepo.listForFlight(flightId)).map(tf => (Object.assign(Object.assign({}, tf), { seats: tf.seats || [] })));
            // if (flight.seats) {
            //   flight.seats = flight.seats.map(seat => {
            //     if (seatNumbers.includes(seat.number)) {
            //       return { ...seat, isBooking: isBooked };
            //     }
            //     return seat;
            //   });
            //   // Save the updated flight
            //   await this.flightRepo.update(flight);
            // }
            console.log("============ TRANSIT FLIGHTS ============");
            console.log("➡️ flight.transitFlights:", JSON.stringify(flight.transitFlights, null, 2));
            console.log("➡️ flight.transitFlights[0]?.seats:", JSON.stringify((_a = flight.transitFlights[0]) === null || _a === void 0 ? void 0 : _a.seats, null, 2));
            console.log("========================================");
            console.log("============ RETURN FLIGHTS ============");
            console.log("➡️ flight.returnFlights:", JSON.stringify(flight.returnFlights, null, 2));
            console.log("➡️ flight.returnFlights[0]?.seats:", JSON.stringify((_b = flight.returnFlights[0]) === null || _b === void 0 ? void 0 : _b.seats, null, 2));
            console.log("========================================");
            // Update seat status
            if ((_d = (_c = flight === null || flight === void 0 ? void 0 : flight.transitFlights) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.seats) {
                flight.transitFlights[0].seats = flight.transitFlights[0].seats.map(seat => {
                    if (seatNumbers.includes(seat.number)) {
                        return Object.assign(Object.assign({}, seat), { isBooking: isBooked });
                    }
                    return seat;
                });
                // Save the updated flight
                yield this.flightRepo.update(flight);
            }
            // Save
            yield this.flightRepo.update(flight);
        });
    }
    updateReturnSeatsStatus(flightId, seatNumbers, isBooked) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const flight = yield this.flightRepo.findById(flightId);
            if (!flight)
                throw new Error("Flight not found");
            // جلب الرحلات المرتبطة وتهيئة الـ seats
            flight.returnFlights = (yield this.returnFlightRepo.listForFlight(flightId)).map(tf => (Object.assign(Object.assign({}, tf), { seats: tf.seats || [] })));
            // if (flight.seats) {
            //   flight.seats = flight.seats.map(seat => {
            //     if (seatNumbers.includes(seat.number)) {
            //       return { ...seat, isBooking: isBooked };
            //     }
            //     return seat;
            //   });
            //   // Save the updated flight
            //   await this.flightRepo.update(flight);
            // }
            console.log("============ RETURN FLIGHTS ============");
            console.log("➡️ flight.returnFlights:", JSON.stringify(flight.returnFlights, null, 2));
            console.log("➡️ flight.returnFlights[0]?.seats:", JSON.stringify((_a = flight.returnFlights[0]) === null || _a === void 0 ? void 0 : _a.seats, null, 2));
            console.log("========================================");
            // Update seat status
            if ((_c = (_b = flight === null || flight === void 0 ? void 0 : flight.returnFlights) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.seats) {
                flight.returnFlights[0].seats = flight.returnFlights[0].seats.map(seat => {
                    if (seatNumbers.includes(seat.number)) {
                        return Object.assign(Object.assign({}, seat), { isBooking: isBooked });
                    }
                    return seat;
                });
                // Save the updated flight
                yield this.flightRepo.update(flight);
            }
            // Save
            yield this.flightRepo.update(flight);
        });
    }
    /**
     * Safely gets a value from DTO, falling back to existing value if DTO value is null or undefined
     * This is specifically typed to work with DeepPartial<FlightEntity>
     */
    getSafeValue(dtoValue, existingValue) {
        if (dtoValue !== null && dtoValue !== undefined) {
            // Handle Date objects specifically
            if (dtoValue instanceof Date) {
                return new Date(dtoValue);
            }
            return dtoValue;
        }
        return (existingValue !== null ? existingValue : undefined);
    }
    ensureNumber(value, defaultValue = 0) {
        if (typeof value === 'number')
            return value;
        if (typeof value === 'string') {
            const num = parseFloat(value);
            return isNaN(num) ? defaultValue : num;
        }
        return defaultValue;
    }
    createFlight(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            const now = new Date();
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const flRepo = manager.getRepository(Flight_model_1.FlightEntity);
                const statusBoolean = String(dto.status).toLowerCase() === "true";
                const statusBoolean2 = String(dto.status).toLowerCase() === "true";
                // Process seats - ensure it's an array and has proper structure
                const seats = Array.isArray(dto.seats)
                    ? dto.seats.map(seat => (Object.assign(Object.assign({}, (typeof seat === 'string' ? { number: seat } : seat)), { id: typeof seat === 'object' && seat.id ? seat.id : Math.random().toString(36).substring(2, 11), isBooking: typeof seat === 'object' ? !!seat.isBooking : false, position: typeof seat === 'object' ? seat.position || '' : '' })))
                    : [];
                // Process transit flights - recursively create transit flights if provided
                // let processedTransitFlights: FlightEntity[] = [];
                // if (dto.transitFlights && Array.isArray(dto.transitFlights)) {
                //   for (const transitFlightData of dto.transitFlights) {
                //     // Create a DTO for the transit flight
                //     const transitFlightDto = {
                //       ...(transitFlightData as any),
                //       transit: true, // Mark as transit flight
                //       transitFlights: [], // Avoid infinite recursion
                //       returnFlights: [] // Avoid infinite recursion
                //     };
                //     // Create the transit flight
                //     const transitFlight = await this.createFlight(transitFlightDto);
                //     const transitFlightEntity = await flRepo.findOneBy({ id: transitFlight.id });
                //     if (transitFlightEntity) {
                //       processedTransitFlights.push(transitFlightEntity);
                //     }
                //   }
                // }
                // Process return flights - recursively create return flights if provided
                let processedReturnFlights = [];
                if (dto.returnFlights && Array.isArray(dto.returnFlights)) {
                    for (const returnFlightData of dto.returnFlights) {
                        // Create a DTO for the return flight
                        const returnFlightDto = Object.assign(Object.assign({}, returnFlightData), { transit: false });
                        // Create the return flight
                        const returnFlight = yield this.createFlight(returnFlightDto);
                        const returnFlightEntity = yield flRepo.findOneBy({ id: returnFlight.id });
                        if (returnFlightEntity) {
                            processedReturnFlights.push(returnFlightEntity);
                        }
                    }
                }
                const flightPartial = {
                    id,
                    status: statusBoolean ? true : false,
                    airlineId: dto.airlineId,
                    clientId: dto.clientId,
                    name: dto.name || '',
                    rating: dto.rating,
                    departureCity: dto.departureCity,
                    arrivalCity: dto.arrivalCity,
                    flightNumber: dto.flightNumber,
                    numberOfStops: dto.numberOfStops,
                    gate: dto.gate,
                    flightDate: dto.flightDate,
                    currency: dto.currency,
                    departureIata: dto.departureIata,
                    arrivalIata: dto.arrivalIata,
                    isSuggested: dto.isSuggested,
                    returnDate: dto.returnDate,
                    departureTime: dto.departureTime,
                    arrivalTime: dto.arrivalTime,
                    flightDuration: this.ensureNumber(dto.flightDuration),
                    bookingClass: dto.bookingClass,
                    inFlightEntertainment: dto.inFlightEntertainment,
                    usbPortOutlet: dto.usbPortOutlet,
                    price: dto.price,
                    discount: dto.discount,
                    aircraftType: dto.aircraftType,
                    seats, // Add the processed seats array
                    // transitFlights: processedTransitFlights, // Add processed transit flights
                    // returnFlights: processedReturnFlights, // Add processed return flights
                    seatLayout: dto.seatLayout,
                    seatPitch: dto.seatPitch,
                    aircraftImage: (_a = dto.aircraftImage) !== null && _a !== void 0 ? _a : undefined,
                    rest: (_b = dto.rest) !== null && _b !== void 0 ? _b : undefined,
                    transit: statusBoolean2 ? true : false,
                    meals: dto.meals,
                    unlimitedInternet: dto.unlimitedInternet,
                    airportTransfer: dto.airportTransfer,
                    extraBaggage: dto.extraBaggage,
                    allSeats: Array.isArray(dto.seats) ? dto.seats.length : 0,
                    created_at: now,
                    updated_at: now
                };
                yield flRepo.save(flRepo.create(flightPartial));
                if (dto.baggage) {
                    const bagRepo = manager.getRepository(FlightBaggage_model_1.FlightBaggageEntity);
                    for (const name of dto.baggage) {
                        yield bagRepo.save({ id: (0, uuid_1.v4)(), flight_id: id, name });
                    }
                }
                if (dto.ratings) {
                    const ratingRepo = manager.getRepository(FlightRating_model_1.FlightRatingEntity);
                    for (const comment of dto.ratings) {
                        yield ratingRepo.save({ id: (0, uuid_1.v4)(), flight_id: id, comment });
                    }
                }
                if (dto.transitFlights) {
                    const tfRepo = manager.getRepository(TransitFlight_model_1.TransitFlightEntity);
                    // Convert the object values to an array of transit flights
                    const transitFlights = Object.values(dto.transitFlights);
                    for (const tf of transitFlights) {
                        // Use the existing ID from the object key or generate a new one
                        const tfId = tf.id || (0, uuid_1.v4)();
                        yield tfRepo.save(Object.assign(Object.assign({}, tf), { id: tfId, flight_id: id }));
                    }
                }
                if (dto.returnFlights) {
                    const rfRepo = manager.getRepository(ReturnFlight_model_1.ReturnFlightEntity);
                    for (const rf of dto.returnFlights) {
                        yield rfRepo.save(Object.assign({ id: (0, uuid_1.v4)(), flight_id: id }, rf));
                    }
                }
                if (dto.amenities) {
                    const amRepo = manager.getRepository(FlightAmenities_model_1.FlightAmenityEntity);
                    for (const name of dto.amenities) {
                        yield amRepo.save({ id: (0, uuid_1.v4)(), flight_id: id, name });
                    }
                }
                // Handle FlightMealEntity (legacy) if meals is an array of strings
                if (dto.meals && Array.isArray(dto.meals)) {
                    // Check if it's an array of strings (legacy format)
                    if (dto.meals.length > 0 && typeof dto.meals[0] === 'string') {
                        const mRepo = manager.getRepository(FlightMeals_model_1.FlightMealEntity);
                        const mealEntities = dto.meals.map(name => ({
                            id: (0, uuid_1.v4)(),
                            name: String(name),
                            flight_id: id
                        }));
                        yield mRepo.save(mealEntities);
                    }
                    // If it's an array of objects, it will be handled by the JSON field in the flight entity
                }
            }));
            return this.getFlight(id);
        });
    }
    listFlights(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const [flights, total] = yield this.flightRepo.findAndCount(filters);
            // Load relations for each flight
            for (const flight of flights) {
                flight.baggage = yield this.baggageRepo.listForFlight(flight.id);
                flight.amenities = yield this.amenityRepo.listForFlight(flight.id);
                // Only load legacy meals if no JSON meals are present
                if (!flight.meals || flight.meals.length === 0) {
                    const legacyMeals = yield this.mealRepo.listForFlight(flight.id);
                    // Convert legacy meals to the new format
                    flight.meals = legacyMeals.map(meal => ({
                        name: meal.name,
                        totalPrice: 0 // Default price for legacy meals
                    }));
                }
                flight.transitFlights = yield this.transitFlightRepo.listForFlight(flight.id);
                flight.returnFlights = yield this.returnFlightRepo.listForFlight(flight.id);
                flight.ratings = yield this.ratingRepo.listForFlight(flight.id);
            }
            return {
                data: flights,
                total,
                page: (_a = filters.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = filters.limit) !== null && _b !== void 0 ? _b : 20,
            };
        });
    }
    getFlight(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fl = yield this.flightRepo.findById(id);
            if (!fl)
                throw new Error("FLIGHT_NOT_FOUND");
            fl.baggage = yield this.baggageRepo.listForFlight(id);
            fl.amenities = yield this.amenityRepo.listForFlight(id);
            // Only load legacy meals if no JSON meals are present
            if (!fl.meals || fl.meals.length === 0) {
                const legacyMeals = yield this.mealRepo.listForFlight(id);
                // Convert legacy meals to the new format
                fl.meals = legacyMeals.map(meal => ({
                    name: meal.name,
                    totalPrice: 0 // Default price for legacy meals
                }));
            }
            fl.ratings = yield this.ratingRepo.listForFlight(id);
            fl.transitFlights = yield this.transitFlightRepo.listForFlight(id);
            fl.returnFlights = yield this.returnFlightRepo.listForFlight(id);
            return fl;
        });
    }
    updateFlight(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!dto) {
                throw new Error("Invalid form data — DTO is undefined. Check parseFlightFormData.");
            }
            const existingFlight = yield this.flightRepo.findById(id);
            if (!existingFlight) {
                throw new Error(`Flight with id ${id} not found.`);
            }
            // Update safely
            existingFlight.status = (_a = dto.status) !== null && _a !== void 0 ? _a : existingFlight.status;
            existingFlight.price = (_b = dto.price) !== null && _b !== void 0 ? _b : existingFlight.price;
            existingFlight.discount = (_c = dto.discount) !== null && _c !== void 0 ? _c : existingFlight.discount;
            existingFlight.updatedAt = new Date();
            return yield this.flightRepo.update(existingFlight);
        });
    }
    deleteFlight(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.flightRepo.delete(id);
        });
    }
    removeBaggage(flight_id, baggageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.baggageRepo.removeById(baggageId);
            return this.baggageRepo.listForFlight(flight_id);
        });
    }
    removeAmenity(flight_id, amenityId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.amenityRepo.removeById(amenityId);
            return this.amenityRepo.listForFlight(flight_id);
        });
    }
    removeRating(flightId, ratingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ratingRepo.remove(flightId, ratingId);
        });
    }
    addRating(flightId, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify flight exists
            const flight = yield this.flightRepo.getFlight(flightId);
            if (!flight) {
                throw new Error('FLIGHT_NOT_FOUND');
            }
            // Ensure rating is a valid number between 1 and 5
            const ratingValue = Number(rating.rating);
            if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
                throw new Error('Rating must be a number between 1 and 5');
            }
            // Create the rating with validated values
            const flightRating = new FlightRating_1.FlightRating((0, uuid_1.v4)(), // Generate a new ID
            flightId, rating.name, rating.comment || '', // Use empty string for empty comments
            ratingValue, // Use the validated number
            rating.images || []);
            const result = yield this.ratingRepo.add(flightId, flightRating);
            // Recompute and persist overall rating as the average of all ratings
            const allRatings = yield this.ratingRepo.listForFlight(flightId);
            if (allRatings && allRatings.length > 0) {
                const sum = allRatings.reduce((acc, r) => acc + Number(r.rating || 0), 0);
                const avg = Math.round((sum / allRatings.length) * 10) / 10; // one decimal place
                yield this.dataSource.getRepository(Flight_model_1.FlightEntity).update(flightId, { rating: avg });
            }
            else {
                yield this.dataSource.getRepository(Flight_model_1.FlightEntity).update(flightId, { rating: 0 });
            }
        });
    }
    // Transit Flights
    // ✅ إضافة ترانزيت لرحلة
    addTransitFlight(flightId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input parameters
            if (!flightId) {
                throw new Error("FLIGHT_ID_REQUIRED");
            }
            if (!dto) {
                throw new Error("TRANSIT_FLIGHT_DATA_REQUIRED");
            }
            // Required fields validation
            const requiredFields = [
                'departureCity', 'arrivalCity', 'departureIata',
                'arrivalIata', 'departureTime', 'arrivalTime',
                'airlineId', 'flightNumber', 'price'
            ];
            const missingFields = requiredFields.filter(field => !dto[field]);
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }
            // Verify flight exists
            const flight = yield this.flightRepo.findById(flightId);
            if (!flight) {
                throw new Error("FLIGHT_NOT_FOUND");
            }
            const now = new Date();
            const transitFlight = new TransitFlight_1.TransitFlight(dto.id || (0, uuid_1.v4)(), flightId, // Ensure flightId is set
            dto.departureCity || '', dto.arrivalCity || '', dto.departureIata || '', dto.arrivalIata || '', dto.departureTime ? new Date(dto.departureTime) : new Date(), dto.arrivalTime ? new Date(dto.arrivalTime) : new Date(), dto.duration || 0, dto.status !== undefined ? dto.status : true, dto.airlineId || '', dto.clientId || '', dto.name || '', dto.seats || [], dto.rating || 0, dto.flightNumber || '', dto.price || 0, dto.currency || 'AED', dto.numberOfStops || 0, dto.availableSeats || 0, dto.aircraftType || '', dto.aircraftImage || '', dto.seatLayout || '', (dto.seatPitch !== undefined && dto.seatPitch !== null) ? String(dto.seatPitch) : '0', dto.createdAt || now, dto.updatedAt || now);
            return this.transitFlightRepo.add(flightId, transitFlight);
        });
    }
    addReturnFlight(flightId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input parameters
            if (!flightId) {
                throw new Error("FLIGHT_ID_REQUIRED");
            }
            if (!dto) {
                throw new Error("RETURN_FLIGHT_DATA_REQUIRED");
            }
            // Required fields validation
            const requiredFields = [
                'departureCity', 'arrivalCity', 'departureIata',
                'arrivalIata', 'departureTime', 'arrivalTime',
                'airlineId', 'flightNumber', 'price'
            ];
            const missingFields = requiredFields.filter(field => !dto[field]);
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }
            // Verify flight exists
            const flight = yield this.flightRepo.findById(flightId);
            if (!flight) {
                throw new Error("FLIGHT_NOT_FOUND");
            }
            const now = new Date();
            const returnFlight = new ReturnFlight_1.ReturnFlight(dto.id || (0, uuid_1.v4)(), flightId, // Ensure flightId is set
            dto.departureCity || '', dto.arrivalCity || '', dto.departureIata || '', dto.arrivalIata || '', dto.departureTime ? new Date(dto.departureTime) : new Date(), dto.arrivalTime ? new Date(dto.arrivalTime) : new Date(), dto.duration || 0, dto.status !== undefined ? dto.status : true, dto.airlineId || '', dto.clientId || '', dto.name || '', dto.seats || [], dto.rating || 0, dto.flightNumber || '', dto.price || 0, dto.currency || 'AED', dto.numberOfStops || 0, dto.availableSeats || 0, dto.aircraftType || '', dto.aircraftImage || '', dto.seatLayout || '', (dto.seatPitch !== undefined && dto.seatPitch !== null) ? String(dto.seatPitch) : '0', dto.createdAt || now, dto.updatedAt || now);
            return this.returnFlightRepo.add(flightId, returnFlight);
        });
    }
    // ✅ جلب كل الترانزيت لرحلة
    // ✅ Get all transit flights for a flight
    listTransitFlights(flightId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transitFlightsRecord = yield this.transitFlightRepo.listForFlight(flightId);
            // Convert the record of transit flights to an array
            return Object.values(transitFlightsRecord);
        });
    }
    // ✅ جلب كل الترانزيت لرحلة
    listReturnFlights(flightId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.returnFlightRepo.listForFlight(flightId);
        });
    }
    // ✅ جلب ترانزيت واحد
    getTransitFlight(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transitFlightRepo.findById(id);
        });
    }
    // ✅ جلب ترانزيت واحد
    getReturnFlight(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.returnFlightRepo.findById(id);
        });
    }
    // ✅ تحديث ترانزيت
    updateTransitFlight(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transitFlightRepo.update(dto);
        });
    }
    // ✅ تحديث ترانزيت
    updateReturnFlight(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.returnFlightRepo.update(dto);
        });
    }
    // ✅ حذف ترانزيت من رحلة
    removeTransitFlight(flightId, transitFlightId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transitFlight = yield this.transitFlightRepo.findById(transitFlightId);
            if (!transitFlight || transitFlight.flightId !== flightId) {
                throw new Error("TRANSIT_FLIGHT_NOT_FOUND");
            }
            yield this.transitFlightRepo.removeById(transitFlightId);
        });
    }
    // ✅ حذف ترانزيت من رحلة
    removeReturnFlight(flightId, returnFlightId) {
        return __awaiter(this, void 0, void 0, function* () {
            const returnFlight = yield this.returnFlightRepo.findById(returnFlightId);
            if (!returnFlight || returnFlight.flightId !== flightId) {
                throw new Error("RETURN_FLIGHT_NOT_FOUND");
            }
            yield this.returnFlightRepo.removeById(returnFlightId);
        });
    }
    removeMeal(flight_id, mealId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mealRepo.removeById(mealId);
            return this.mealRepo.listForFlight(flight_id);
        });
    }
};
exports.FlightService = FlightService;
exports.FlightService = FlightService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.FlightRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.FlightBaggageRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.FlightAmenityRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.FlightMealRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.FlightRatingRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.TransitFlightRepository)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.ReturnFlightRepository)),
    __param(7, (0, inversify_1.inject)("DataSource")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Function])
], FlightService);
