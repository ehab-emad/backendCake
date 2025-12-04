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
exports.FlightController = void 0;
const inversify_1 = require("inversify");
const FlightService_1 = require("../../application/services/FlightService");
const types_1 = require("../../shared/di/types");
const FilterFlight_dto_1 = require("../../application/dto/FilterFlight.dto");
const validation_middleware_1 = require("../middleware/validation.middleware");
let FlightController = class FlightController {
    constructor(svc) {
        this.svc = svc;
    }
    parseFlightFormData(body) {
        // Ensure body exists and has valid structure
        if (!body || typeof body !== 'object') {
            throw new Error('Invalid request body');
        }
        // Convert string values to their appropriate types
        const result = Object.assign(Object.assign(Object.assign(Object.assign({}, body), { 
            // Convert status from string to boolean if needed
            status: body.status !== undefined
                ? typeof body.status === 'string'
                    ? body.status.toLowerCase() === 'true'
                    : Boolean(body.status)
                : true, numberOfStops: body.numberOfStops ? parseInt(body.numberOfStops, 10) : 0, availableSeats: body.availableSeats ? parseInt(body.availableSeats, 10) : 0, price: body.price ? parseFloat(body.price) : 0, discount: body.discount ? parseFloat(body.discount) : undefined, flightDate: body.flightDate || undefined, currency: body.currency || 'AED', departureIata: body.departureIata || null, arrivalIata: body.arrivalIata || null, isSuggested: body.isSuggested || false, gate: body.gate || null, bookingClass: body.bookingClass || null, inFlightEntertainment: body.inFlightEntertainment || false, usbPortOutlet: body.usbPortOutlet || false, seatLayout: body.seatLayout || null, seatPitch: body.seatPitch || null, aircraftType: body.aircraftType || null, aircraftImage: body.aircraftImage || null, rest: body.rest, transit: body.transit, 
            // Handle meals - could be string, array, or single object
            meals: (() => {
                if (!body.meals)
                    return [];
                if (Array.isArray(body.meals))
                    return body.meals;
                try {
                    return typeof body.meals === 'string' ? JSON.parse(body.meals) : [body.meals];
                }
                catch (_a) {
                    return [];
                }
            })(), 
            // Handle other JSON fields
            unlimitedInternet: typeof body.unlimitedInternet === 'string' ? JSON.parse(body.unlimitedInternet) : body.unlimitedInternet, airportTransfer: typeof body.airportTransfer === 'string' ? JSON.parse(body.airportTransfer) : body.airportTransfer, extraBaggage: typeof body.extraBaggage === 'string' ? JSON.parse(body.extraBaggage) : body.extraBaggage, seats: (() => {
                const seats = typeof body.seats === 'string' ? JSON.parse(body.seats) : body.seats;
                return Array.isArray(seats)
                    ? seats.map((seat) => (Object.assign(Object.assign({}, seat), { id: seat.id || Math.random().toString(36).substring(2, 11) // Generate a random ID if not provided
                     })))
                    : [];
            })(), returnDate: body.returnDate || undefined, transitFlights: (() => {
                if (!body.transitFlights)
                    return [];
                if (Array.isArray(body.transitFlights))
                    return body.transitFlights;
                try {
                    return typeof body.transitFlights === 'string'
                        ? JSON.parse(body.transitFlights)
                        : [body.transitFlights];
                }
                catch (e) {
                    console.error('Error parsing transitFlights:', e);
                    return [];
                }
            })(), returnFlights: (() => {
                if (!body.returnFlights)
                    return [];
                if (Array.isArray(body.returnFlights))
                    return body.returnFlights;
                try {
                    return typeof body.returnFlights === 'string'
                        ? JSON.parse(body.returnFlights)
                        : [body.returnFlights];
                }
                catch (e) {
                    console.error('Error parsing returnFlights:', e);
                    return [];
                }
            })() }), (body.flightDuration !== undefined && {
            flightDuration: Number(body.flightDuration) || 0
        })), { 
            // Handle arrays if they're sent as comma-separated strings
            baggage: body.baggage ? (Array.isArray(body.baggage) ? body.baggage : body.baggage.split(',')) : [], amenities: body.amenities ? (Array.isArray(body.amenities) ? body.amenities : body.amenities.split(',')) : [], 
            // meals is already handled above with JSON parsing
            ratings: body.ratings ? (Array.isArray(body.ratings) ? body.ratings : body.ratings.split(',')) : [] });
        return result;
    }
    formatFlightResponse(flight) {
        return Object.assign(Object.assign({}, flight), { flightDuration: Number(flight.flightDuration) || 0, 
            // Ensure other numeric fields are properly converted
            numberOfStops: Number(flight.numberOfStops) || 0, transit: flight.transit, rest: flight.rest, availableSeats: Number(flight.availableSeats) || 0, price: Number(flight.price) || 0, discount: flight.discount !== undefined ? Number(flight.discount) : undefined });
    }
    createFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    req.body.aircraftImage = req.file.path;
                }
                const formData = this.parseFlightFormData(req.body);
                const dto = formData;
                const flight = yield this.svc.createFlight(dto);
                res.status(201).json(this.formatFlightResponse(flight));
            }
            catch (err) {
                next(err);
            }
        });
    }
    // List all flights with optional filtering
    listFlights(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate query parameters
                yield (0, validation_middleware_1.validationMiddleware)(FilterFlight_dto_1.FilterFlightSchema, "query")(req, res, () => __awaiter(this, void 0, void 0, function* () {
                    const filters = FilterFlight_dto_1.FilterFlightSchema.parse(req.query);
                    const result = yield this.svc.listFlights(filters);
                    // Map the data to include image URLs and other relations
                    const data = result.data.map(flight => this.formatFlightResponse(flight));
                    res.json(Object.assign(Object.assign({}, result), { data }));
                }));
            }
            catch (err) {
                console.error('Error in FlightController.listFlights:', err);
                next(err);
            }
        });
    }
    ;
    getFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const flight = yield this.svc.getFlight(req.params.id);
                res.json(this.formatFlightResponse(flight));
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // ✅ لو في ملف مرفوع (صورة الطائرة) نحط المسار داخل body
                if (req.file) {
                    req.body.aircraftImage = req.file.path;
                }
                // ✅ نحول البيانات بشكل آمن
                const formData = this.parseFlightFormData(req.body);
                // ✅ تأكيد أن الـ DTO موجود
                if (!formData) {
                    return res.status(400).json({
                        error: "Invalid form data — DTO is undefined. Check parseFlightFormData.",
                    });
                }
                const dto = formData;
                // ✅ استدعاء الخدمة لتحديث الرحلة
                const updatedFlight = yield this.svc.updateFlight(req.params.id, dto);
                // ✅ تأكيد أن الرحلة موجودة
                if (!updatedFlight) {
                    return res.status(404).json({ error: "Flight not found" });
                }
                // ✅ إرسال النتيجة بعد التنسيق
                res.status(200).json(this.formatFlightResponse(updatedFlight));
            }
            catch (err) {
                console.error("Error in updateFlight controller:", err);
                next(err);
            }
        });
    }
    deleteFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.deleteFlight(req.params.id);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
    }
    removeBaggage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const arr = yield this.svc.removeBaggage(req.params.id, req.params.baggageId);
                res.json(arr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    removeAmenity(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const arr = yield this.svc.removeAmenity(req.params.id, req.params.amenityId);
                res.json(arr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    removeRating(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const arr = yield this.svc.removeRating(req.params.id, req.params.ratingId);
                res.json(arr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    removeMeal(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const arr = yield this.svc.removeMeal(req.params.id, req.params.mealId);
                res.json(arr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    addRating(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, comment, rating } = req.body;
                const flightId = req.params.id;
                // Convert rating to number and validate
                const ratingValue = Number(rating);
                if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
                    return res.status(400).json({ error: 'Rating must be a valid number between 1 and 5' });
                }
                // Handle file uploads if any
                const images = [];
                if (req.file) {
                    images.push(req.file.path);
                }
                const result = yield this.svc.addRating(flightId, {
                    name,
                    comment: comment || undefined,
                    rating: ratingValue,
                    images: images.length > 0 ? images : undefined
                });
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Add a transit flight to a specific flight
    addTransitFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: flightId } = req.params;
                // Default values for all fields
                const now = new Date();
                const defaultValues = {
                    departureCity: '',
                    arrivalCity: '',
                    departureIata: '',
                    arrivalIata: '',
                    departureTime: now,
                    arrivalTime: now,
                    duration: 0,
                    status: true,
                    airlineId: '',
                    flightNumber: '',
                    price: 0,
                    currency: 'AED',
                    numberOfStops: 0,
                    availableSeats: 0,
                    departureTerminal: '',
                    arrivalTerminal: '',
                    // Optional fields with defaults
                    clientId: undefined,
                    name: undefined,
                    rating: 0,
                    aircraftType: undefined,
                    aircraftImage: req.body.aircraftImage || undefined, // Comes from file upload
                    seatLayout: undefined,
                    seatPitch: undefined,
                    seats: []
                };
                // Parse form data with proper type conversion
                const parseFormData = (data, defaults) => {
                    const result = Object.assign({}, defaults);
                    // Handle each field with appropriate type conversion
                    for (const [key, defaultValue] of Object.entries(defaults)) {
                        if (data[key] !== undefined) {
                            switch (typeof defaultValue) {
                                case 'number':
                                    result[key] = parseFloat(data[key]) || 0;
                                    break;
                                case 'boolean':
                                    result[key] = String(data[key]).toLowerCase() === 'true';
                                    break;
                                case 'object':
                                    if (defaultValue instanceof Date) {
                                        result[key] = new Date(data[key]);
                                    }
                                    else if (Array.isArray(defaultValue)) {
                                        if (key === 'seats' && data[key]) {
                                            result[key] = Array.isArray(data[key])
                                                ? data[key].map((seat) => (Object.assign({ number: String(seat.number || seat), isBooking: Boolean(seat.isBooking || false) }, (seat.position && { position: String(seat.position) }))))
                                                : [{
                                                        number: String(data[key]),
                                                        isBooking: false
                                                    }];
                                        }
                                        else {
                                            result[key] = Array.isArray(data[key]) ? data[key] : [];
                                        }
                                    }
                                    else {
                                        result[key] = data[key];
                                    }
                                    break;
                                default:
                                    result[key] = data[key] !== undefined ? String(data[key]) : defaultValue;
                            }
                        }
                    }
                    return result;
                };
                // Parse the form data with defaults
                const transitData = parseFormData(req.body, defaultValues);
                // Log the data being sent to the service (for debugging)
                console.log('Creating transit flight with data:', {
                    flightId,
                    transitData: Object.assign(Object.assign({}, transitData), { 
                        // Don't log the entire seats array if it's large
                        seats: transitData.seats ? `${transitData.seats.length} seats` : 'none' })
                });
                // Call the service to create the transit flight
                const transitFlight = yield this.svc.addTransitFlight(flightId, transitData);
                // Return success response
                res.status(201).json({
                    success: true,
                    data: transitFlight
                });
            }
            catch (err) {
                console.error('Error in addTransitFlight:', err);
                next(err);
            }
        });
    }
    addReturnFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: flightId } = req.params;
                const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
                const dto = Object.assign(Object.assign({}, body), { flightId, status: body.status !== undefined
                        ? typeof body.status === "string"
                            ? body.status.toLowerCase() === "true"
                            : Boolean(body.status)
                        : true, duration: body.duration ? Number(body.duration) : 0, price: body.price ? Number(body.price) : 0, availableSeats: body.availableSeats ? Number(body.availableSeats) : 0 });
                const returnFlight = yield this.svc.addReturnFlight(flightId, dto);
                res.status(201).json({
                    success: true,
                    data: returnFlight
                });
            }
            catch (err) {
                console.error('Error in addReturnFlight:', err);
                next(err);
            }
        });
    }
    updateTransitFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // parse body safely
                const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
                const dto = Object.assign(Object.assign({}, body), { id, status: body.status !== undefined
                        ? typeof body.status === "string"
                            ? body.status.toLowerCase() === "true"
                            : Boolean(body.status)
                        : true, duration: body.duration ? Number(body.duration) : 0, price: body.price ? Number(body.price) : 0, availableSeats: body.availableSeats ? Number(body.availableSeats) : 0, numberOfStops: body.numberOfStops ? Number(body.numberOfStops) : 0, seats: Array.isArray(body.seats)
                        ? body.seats
                        : typeof body.seats === "string"
                            ? JSON.parse(body.seats)
                            : [] });
                const transitFlight = yield this.svc.updateTransitFlight(dto);
                res.json(transitFlight);
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateReturnFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // parse body safely
                const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
                const dto = Object.assign(Object.assign({}, body), { id, status: body.status !== undefined
                        ? typeof body.status === "string"
                            ? body.status.toLowerCase() === "true"
                            : Boolean(body.status)
                        : true, duration: body.duration ? Number(body.duration) : 0, price: body.price ? Number(body.price) : 0, availableSeats: body.availableSeats ? Number(body.availableSeats) : 0, numberOfStops: body.numberOfStops ? Number(body.numberOfStops) : 0, seats: Array.isArray(body.seats)
                        ? body.seats
                        : typeof body.seats === "string"
                            ? JSON.parse(body.seats)
                            : [] });
                const returnFlight = yield this.svc.updateReturnFlight(dto);
                res.json(returnFlight);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // ✅ جلب كل الترانزيت لرحلة
    listTransitFlights(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { flightId } = req.params;
                const transits = yield this.svc.listTransitFlights(flightId);
                res.json(transits);
            }
            catch (err) {
                next(err);
            }
        });
    }
    listReturnFlights(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { flightId } = req.params;
                const returns = yield this.svc.listReturnFlights(flightId);
                res.json(returns);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // ✅ جلب ترانزيت واحد
    getTransitFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const transit = yield this.svc.getTransitFlight(id);
                if (!transit) {
                    return res.status(404).json({ message: "Transit flight not found" });
                }
                res.json(transit);
            }
            catch (err) {
                next(err);
            }
        });
    }
    getReturnFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const returnFlight = yield this.svc.getReturnFlight(id);
                if (!returnFlight) {
                    return res.status(404).json({ message: "Return flight not found" });
                }
                res.json(returnFlight);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // ✅ تحديث ترانزيت
    // ✅ حذف ترانزيت
    removeTransitFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { flightId, id } = req.params;
                yield this.svc.removeTransitFlight(flightId, id);
                res.status(204).send();
            }
            catch (err) {
                next(err);
            }
        });
    }
    removeReturnFlight(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { flightId, id } = req.params;
                yield this.svc.removeReturnFlight(flightId, id);
                res.status(204).send();
            }
            catch (err) {
                next(err);
            }
        });
    }
};
exports.FlightController = FlightController;
exports.FlightController = FlightController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.FlightService)),
    __metadata("design:paramtypes", [FlightService_1.FlightService])
], FlightController);
