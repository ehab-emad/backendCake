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
exports.FlightRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Flight_model_1 = require("../models/Flight.model");
const Flight_1 = require("../../../core/entities/Flight");
let FlightRepository = class FlightRepository {
    toNumber(value) {
        if (value === null || value === undefined || value === '')
            return undefined;
        if (typeof value === 'number')
            return value;
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
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
    nullToUndefined(value) {
        return value === null ? undefined : value;
    }
    // private convertTransitFlightsToFlights(transitFlights: FlightEntity[]): Flight[] {
    //   return transitFlights.map(ent => {
    //     return new Flight(
    //       ent.id,
    //       Boolean(ent.status),
    //       ent.airlineId,
    //       ent.clientId,
    //       ent.name || '',
    //       this.ensureNumber(ent.rating),
    //       ent.departureCity,
    //       ent.arrivalCity,
    //       ent.flightNumber,
    //       ent.numberOfStops,
    //       ent.gate ?? null,
    //       ent.flightDate,
    //       ent.currency,
    //       ent.returnDate,
    //       ent.departureTime && typeof ent.departureTime === 'object' && 'getTime' in ent.departureTime
    //         ? (ent.departureTime as Date).toISOString()
    //         : (ent.departureTime || ''),
    //       ent.arrivalTime && typeof ent.arrivalTime === 'object' && 'getTime' in ent.arrivalTime
    //         ? (ent.arrivalTime as Date).toISOString()
    //         : (ent.arrivalTime || ''),
    //       this.ensureNumber(ent.flightDuration),
    //       ent.bookingClass,
    //       ent.inFlightEntertainment,
    //       ent.usbPortOutlet,
    //       ent.aircraftType,
    //       this.toNumber(ent.price),
    //       this.toNumber(ent.discount) ?? 0,
    //       ent.seatLayout,
    //       ent.seatPitch,
    //       ent.aircraftImage,
    //       ent.rest,
    //       Boolean(ent.transit),
    //       ent.departureIata,
    //       ent.arrivalIata,
    //       ent.isSuggested,
    //       [], // baggage
    //       [], // amenities
    //       [], // flightMeals
    //       [], // ratings
    //       [], // transitFlights
    //       [], // returnFlights
    //       ent.meals || [], // meals JSON array
    //       ent.unlimitedInternet || [], // unlimitedInternet JSON array
    //       ent.airportTransfer || [], // airportTransfer JSON array
    //       ent.extraBaggage || [], // extraBaggage JSON array
    //       ent.seats || [], // seats JSON array
    //       // transitFlights JSON array
    //       // this.convertTransitFlightsToFlights(ent.returnFlights || []), // returnFlights JSON array
    //       new Date(ent.created_at),
    //       ent.updated_at ? new Date(ent.updated_at) : new Date()
    //     );
    //   });
    // }
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized)
            throw new Error("DataSource not initialized");
        return database_config_1.AppDataSource.getRepository(Flight_model_1.FlightEntity);
    }
    getFlight(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const ent = yield this.repo.findOneBy({ id });
            if (!ent)
                throw new Error('Flight not found');
            const flight = new Flight_1.Flight(ent.id, Boolean((_a = ent.status) !== null && _a !== void 0 ? _a : true), // Ensure status is always a boolean
            ent.airlineId, ent.clientId, ent.name || '', this.ensureNumber(ent.rating), ent.departureCity, ent.arrivalCity, ent.flightNumber, ent.numberOfStops, (_b = ent.gate) !== null && _b !== void 0 ? _b : null, ent.flightDate, ent.currency, ent.returnDate, ent.departureTime, ent.arrivalTime, this.ensureNumber(ent.flightDuration), ent.bookingClass, ent.inFlightEntertainment, ent.usbPortOutlet, ent.aircraftType, this.toNumber(ent.price), (_c = this.toNumber(ent.discount)) !== null && _c !== void 0 ? _c : 0, ent.seatLayout, ent.seatPitch, ent.aircraftImage, ent.rest, Boolean(ent.transit), ent.departureIata, ent.arrivalIata, ent.isSuggested, [], // baggage
            [], // amenities
            [], // flightMeals
            [], // ratings
            ent.transitFlights || [], // transitFlights
            ent.returnFlights || [], // returnFlights
            ent.meals || [], // meals JSON array
            ent.unlimitedInternet || [], // unlimitedInternet JSON array
            ent.airportTransfer || [], // airportTransfer JSON array
            ent.extraBaggage || [], // extraBaggage JSON array
            ent.seats || [], // seats JSON array
            // /  this.convertTransitFlightsToFlights(ent.transitFlights || []), // transitFlights JSON array
            new Date(ent.created_at), ent.updated_at ? new Date(ent.updated_at) : new Date());
            return flight;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getFlight(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    findAllByClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({ where: { clientId } });
            return ents.map((ent) => {
                var _a, _b;
                const f = new Flight_1.Flight(ent.id, ent.status, ent.airlineId, ent.clientId, ent.name || '', this.ensureNumber(ent.rating), ent.departureCity, ent.arrivalCity, ent.flightNumber, ent.numberOfStops, (_a = ent.gate) !== null && _a !== void 0 ? _a : null, ent.flightDate, ent.currency, ent.returnDate, ent.departureTime && typeof ent.departureTime === 'object' && 'getTime' in ent.departureTime
                    ? ent.departureTime.toISOString()
                    : (ent.departureTime || ''), ent.arrivalTime && typeof ent.arrivalTime === 'object' && 'getTime' in ent.arrivalTime
                    ? ent.arrivalTime.toISOString()
                    : (ent.arrivalTime || ''), this.ensureNumber(ent.flightDuration), ent.bookingClass, ent.inFlightEntertainment, ent.usbPortOutlet, ent.aircraftType, this.toNumber(ent.price), (_b = this.toNumber(ent.discount)) !== null && _b !== void 0 ? _b : 0, ent.seatLayout, ent.seatPitch, ent.aircraftImage, ent.rest, Boolean(ent.transit), ent.departureIata, ent.arrivalIata, ent.isSuggested, [], // baggage
                [], // amenities
                [], // flightMeals
                [], // ratings
                [], // transitFlights
                [], // returnFlights
                ent.meals || [], // meals JSON array
                ent.unlimitedInternet || [], // unlimitedInternet JSON array
                ent.airportTransfer || [], // airportTransfer JSON array
                ent.extraBaggage || [], // extraBaggage JSON array
                ent.seats || [], // seats JSON array
                // this.convertTransitFlightsToFlights(ent.transitFlights || []), // transitFlights JSON array
                // this.convertTransitFlightsToFlights(ent.returnFlights || []), // returnFlights JSON array
                new Date(ent.created_at), ent.updated_at ? new Date(ent.updated_at) : new Date());
                return f;
            });
        });
    }
    findAndCount(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create base query builder with relations
            let qb = this.repo
                .createQueryBuilder('f')
                .leftJoinAndSelect('f.airline', 'airline')
                .leftJoinAndSelect('f.baggage', 'baggage')
                .leftJoinAndSelect('f.amenities', 'amenities')
                .leftJoinAndSelect('f.flightMeals', 'flightMeals');
            // .leftJoinAndSelect('f.transitFlights', 'transitFlights')
            // .leftJoinAndSelect('f.returnFlights', 'returnFlights');
            // Apply client filter
            if (filters.clientId) {
                qb = qb.where('f.client_id = :clientId', { clientId: filters.clientId });
            }
            else {
                qb = qb.where('1=1'); // Default condition when no client filter
            }
            // Apply status filter
            if (filters.status && filters.status !== 'all') {
                const isActive = filters.status === 'active';
                qb = qb.andWhere('f.status = :isActive', { isActive });
            }
            // Apply name search filter
            if (filters.name) {
                qb = qb.andWhere('LOWER(f.name) LIKE :name', {
                    name: `%${filters.name.toLowerCase()}%`
                });
            }
            // Apply flight number filter
            if (filters.flightNumber) {
                qb = qb.andWhere('LOWER(f.flightNumber) LIKE :flightNumber', {
                    flightNumber: `%${filters.flightNumber.toLowerCase()}%`
                });
            }
            // Apply departure city filter
            if (filters.departureCity) {
                qb = qb.andWhere('LOWER(f.departureCity) LIKE :departureCity', {
                    departureCity: `%${filters.departureCity.toLowerCase()}%`
                });
            }
            // Apply arrival city filter
            if (filters.arrivalCity) {
                qb = qb.andWhere('LOWER(f.arrivalCity) LIKE :arrivalCity', {
                    arrivalCity: `%${filters.arrivalCity.toLowerCase()}%`
                });
            }
            // Apply flight date filter
            if (filters.flightDate) {
                const startDate = new Date(filters.flightDate);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                qb = qb.andWhere('f.departureTime BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate
                });
            }
            // For backward compatibility
            else if (filters.departureDateFrom || filters.departureDateTo) {
                if (filters.departureDateFrom) {
                    qb = qb.andWhere('f.departureTime >= :departureDateFrom', {
                        departureDateFrom: new Date(filters.departureDateFrom)
                    });
                }
                if (filters.departureDateTo) {
                    const endDate = new Date(filters.departureDateTo);
                    endDate.setHours(23, 59, 59, 999);
                    qb = qb.andWhere('f.departureTime <= :departureDateTo', {
                        departureDateTo: endDate
                    });
                }
            }
            // Apply price filters
            if (filters.minPrice !== undefined) {
                qb = qb.andWhere('f.price >= :minPrice', { minPrice: filters.minPrice });
            }
            if (filters.maxPrice !== undefined) {
                qb = qb.andWhere('f.price <= :maxPrice', { maxPrice: filters.maxPrice });
            }
            // Apply airline filter
            if (filters.airlineId) {
                qb = qb.andWhere('f.airlineId = :airlineId', { airlineId: filters.airlineId });
            }
            // Apply stops filter
            if (filters.maxStops !== undefined) {
                qb = qb.andWhere('f.numberOfStops <= :maxStops', { maxStops: filters.maxStops });
            }
            // Apply booking class filter
            if (filters.bookingClass) {
                qb = qb.andWhere('LOWER(f.bookingClass) = :bookingClass', {
                    bookingClass: filters.bookingClass.toLowerCase()
                });
            }
            // Apply amenities filters
            if (filters.hasWifi !== undefined) {
                qb = qb.andWhere('f.hasWifi = :hasWifi', { hasWifi: filters.hasWifi });
            }
            if (filters.hasEntertainment !== undefined) {
                qb = qb.andWhere('f.hasEntertainment = :hasEntertainment', {
                    hasEntertainment: filters.hasEntertainment
                });
            }
            if (filters.hasMeal !== undefined) {
                qb = qb.andWhere('f.hasMeal = :hasMeal', { hasMeal: filters.hasMeal });
            }
            // Apply rating filter
            if (filters.minRating !== undefined) {
                qb = qb.andWhere('f.rating >= :minRating', { minRating: filters.minRating });
            }
            // Get total count with current filters before applying pagination
            const total = yield qb.getCount();
            // Apply sorting
            if (filters.sortBy) {
                const orderDirection = (filters.sortOrder || 'asc').toUpperCase();
                switch (filters.sortBy) {
                    case 'price':
                        qb = qb.orderBy('f.price', orderDirection);
                        break;
                    case 'departureTime':
                        qb = qb.orderBy('f.departureTime', orderDirection);
                        break;
                    case 'arrivalTime':
                        qb = qb.orderBy('f.arrivalTime', orderDirection);
                        break;
                    case 'duration':
                        qb = qb.orderBy('f.flightDuration', orderDirection);
                        break;
                    case 'stops':
                        qb = qb.orderBy('f.numberOfStops', orderDirection);
                        break;
                    case 'airline':
                        qb = qb.orderBy('airline.name', orderDirection); // Updated to use joined relation
                        break;
                    default:
                        qb = qb.orderBy('f.departureTime', 'ASC');
                }
            }
            else {
                // Default sorting by departure time
                qb = qb.orderBy('f.departureTime', 'ASC');
            }
            // Apply pagination
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            qb = qb.skip((page - 1) * limit).take(limit);
            // Execute the query and get results
            const ents = yield qb.getMany();
            const flights = ents.map((ent) => {
                var _a, _b, _c;
                const f = new Flight_1.Flight(ent.id, Boolean(ent.status), ent.airlineId, ent.clientId, ent.name || '', this.ensureNumber(ent.rating), ent.departureCity, ent.arrivalCity, ent.flightNumber, ent.numberOfStops, (_a = ent.gate) !== null && _a !== void 0 ? _a : null, ent.flightDate, ent.currency, ent.returnDate, ent.departureTime && typeof ent.departureTime === 'object' && 'getTime' in ent.departureTime
                    ? ent.departureTime.toISOString()
                    : (ent.departureTime || ''), ent.arrivalTime && typeof ent.arrivalTime === 'object' && 'getTime' in ent.arrivalTime
                    ? ent.arrivalTime.toISOString()
                    : (ent.arrivalTime || ''), this.ensureNumber(ent.flightDuration), ent.bookingClass, ent.inFlightEntertainment, ent.usbPortOutlet, ent.aircraftType, this.toNumber(ent.price), (_b = this.toNumber(ent.discount)) !== null && _b !== void 0 ? _b : 0, ent.seatLayout, ent.seatPitch, ent.aircraftImage, ent.rest, Boolean(ent.transit), ent.departureIata, ent.arrivalIata, ent.isSuggested, [], // baggage
                [], // amenities
                [], // flightMeals
                [], // ratings
                [], // transitFlights
                [], // returnFlights
                ent.meals || [], // meals JSON array
                ent.unlimitedInternet || [], // unlimitedInternet JSON array
                ent.airportTransfer || [], // airportTransfer JSON array
                ent.extraBaggage || [], // extraBaggage JSON array
                ent.seats || [], // seats JSON array
                // this.convertTransitFlightsToFlights(ent.transitFlights || []), // transitFlights JSON array
                // this.convertTransitFlightsToFlights(ent.returnFlights || []), // returnFlights JSON array
                new Date(ent.created_at), ent.updated_at ? new Date(ent.updated_at) : new Date());
                f.aircraftImage = (_c = ent.aircraftImage) !== null && _c !== void 0 ? _c : null;
                return f;
            });
            return [flights, total];
        });
    }
    create(f) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(f));
        });
    }
    update(f) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.update(f.id, this.toEntity(f));
            // Return the updated flight by fetching it again
            return yield this.getFlight(f.id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    toEntity(f) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const ent = new Flight_model_1.FlightEntity();
        ent.id = f.id;
        ent.status = f.status;
        ent.airlineId = f.airlineId;
        ent.clientId = f.clientId;
        ent.name = f.name || '';
        ent.rating = f.rating;
        ent.departureCity = f.departureCity;
        ent.arrivalCity = f.arrivalCity;
        ent.flightNumber = (_a = f.flightNumber) !== null && _a !== void 0 ? _a : undefined;
        ent.numberOfStops = f.numberOfStops;
        ent.gate = (_b = f.gate) !== null && _b !== void 0 ? _b : undefined;
        // Ensure date fields are properly converted to Date objects
        const flightDate = f.flightDate;
        ent.flightDate = flightDate && typeof flightDate === 'object' && 'getTime' in flightDate
            ? flightDate
            : new Date(flightDate || 0);
        const returnDate = f.returnDate;
        ent.returnDate = returnDate && typeof returnDate === 'object' && 'getTime' in returnDate
            ? returnDate
            : new Date(returnDate || 0);
        // Convert time fields to string format if they are Date objects
        const departureTime = f.departureTime;
        ent.departureTime = departureTime && typeof departureTime === 'object' && 'getTime' in departureTime
            ? departureTime.toISOString()
            : (departureTime || '');
        const arrivalTime = f.arrivalTime;
        ent.arrivalTime = arrivalTime && typeof arrivalTime === 'object' && 'getTime' in arrivalTime
            ? arrivalTime.toISOString()
            : (arrivalTime || '');
        ent.flightDuration = f.flightDuration;
        // Calculate available seats from seats array where isBooking is false
        ent.availableSeats = Array.isArray(f.seats)
            ? f.seats.filter(seat => seat.isBooking === false).length
            : 0;
        ent.bookingClass = f.bookingClass;
        ent.inFlightEntertainment = f.inFlightEntertainment;
        ent.usbPortOutlet = f.usbPortOutlet;
        ent.price = (_c = f.price) !== null && _c !== void 0 ? _c : undefined;
        ent.discount = (_d = f.discount) !== null && _d !== void 0 ? _d : undefined;
        ent.aircraftType = String(f.aircraftType); // Ensure string type
        ent.seatLayout = (_e = f.seatLayout) !== null && _e !== void 0 ? _e : undefined;
        ent.seatPitch = (_f = f.seatPitch) !== null && _f !== void 0 ? _f : undefined;
        ent.aircraftImage = (_g = f.aircraftImage) !== null && _g !== void 0 ? _g : undefined;
        ent.rest = (_h = f.rest) !== null && _h !== void 0 ? _h : undefined;
        ent.transit = f.transit;
        ent.currency = f.currency;
        ent.departureIata = (_j = f.departureIata) !== null && _j !== void 0 ? _j : undefined;
        ent.arrivalIata = (_k = f.arrivalIata) !== null && _k !== void 0 ? _k : undefined;
        ent.isSuggested = f.isSuggested;
        ent.allSeats = Array.isArray(f.seats) ? f.seats.length : 0;
        // Using snake_case to match the entity model
        ent.created_at = f.createdAt;
        ent.updated_at = f.updatedAt;
        // Convert transit flights back to entities
        // ent.transitFlights = Array.isArray(f.transitFlights) 
        //   ? f.transitFlights.map(flight => this.toEntity(flight))
        //   : [];
        // Convert return flights back to entities
        // ent.returnFlights = Array.isArray(f.returnFlights)
        //   ? f.returnFlights.map(flight => this.toEntity(flight))
        //   : [];
        return ent;
    }
};
exports.FlightRepository = FlightRepository;
exports.FlightRepository = FlightRepository = __decorate([
    (0, inversify_1.injectable)()
], FlightRepository);
