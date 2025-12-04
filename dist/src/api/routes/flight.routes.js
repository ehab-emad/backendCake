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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const inversify_1 = require("inversify");
const FlightController_1 = require("../controllers/FlightController");
const types_1 = require("../../shared/di/types");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
let FlightRoutes = class FlightRoutes {
    constructor(flightController) {
        this.flightController = flightController;
        this.router = (0, express_1.Router)();
        this.storage = multer_1.default.diskStorage({
            destination: "uploads/flights/",
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = require('path').extname(file.originalname);
                cb(null, uniqueSuffix + ext);
            }
        });
        // Configure multer for file uploads
        this.upload = (0, multer_1.default)({
            storage: this.storage,
            limits: {
                fileSize: 10 * 1024 * 1024 // 10MB
            }
        }).single('aircraftImage');
        this.ratingUpload = (0, multer_1.default)({
            storage: multer_1.default.diskStorage({
                destination: "uploads/ratings/",
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = require('path').extname(file.originalname);
                    cb(null, uniqueSuffix + ext);
                }
            }),
            limits: {
                fileSize: 5 * 1024 * 1024 // 5MB per file
            }
        }).array('images', 5); // Allow up to 5 images
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.post("/", AuthMiddleware_1.authenticateJWT, (req, res, next) => {
            this.upload(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return next(err);
                try {
                    yield this.flightController.createFlight(req, res, next);
                }
                catch (error) {
                    next(error);
                }
            }));
        });
        this.router.put("/:id", AuthMiddleware_1.authenticateJWT, (req, res, next) => {
            this.upload(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return next(err);
                try {
                    yield this.flightController.updateFlight(req, res, next);
                }
                catch (error) {
                    next(error);
                }
            }));
        });
        // List all flights
        this.router.get("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.flightController.listFlights(req, res, next);
            }
            catch (error) {
                next(error);
            }
        }));
        // Get flight by ID
        this.router.get("/:id", (req, res, next) => this.flightController.getFlight(req, res, next).catch(next));
        // Flight amenities
        this.router.delete("/:id/amenities/:amenityId", AuthMiddleware_1.authenticateJWT, (req, res, next) => this.flightController.removeAmenity(req, res, next).catch(next));
        // Flight meals
        this.router.delete("/:id/meals/:mealId", AuthMiddleware_1.authenticateJWT, (req, res, next) => this.flightController.removeMeal(req, res, next).catch(next));
        this.router.delete("/:id/", AuthMiddleware_1.authenticateJWT, (req, res, next) => this.flightController.deleteFlight(req, res, next).catch(next));
        // Flight ratings
        this.router.delete("/:id/ratings/:ratingId", AuthMiddleware_1.authenticateJWT, (req, res, next) => this.flightController.removeRating(req, res, next).catch(next));
        // Add rating to flight
        this.router.post("/:id/ratings", AuthMiddleware_1.authenticateJWT, (req, res, next) => {
            this.ratingUpload(req, res, (err) => {
                if (err)
                    return next(err);
                this.flightController.addRating(req, res, next).catch(next);
            });
        });
        // List all transit flights for a flight
        this.router.get("/:id/transit-flights", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.flightController.listTransitFlights(req, res, next);
            }
            catch (error) {
            }
        }));
        this.router.get("/:id/return-flights", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.flightController.listReturnFlights(req, res, next);
            }
            catch (error) {
            }
        }));
        // Add a transit flight to a flight with file upload support
        this.router.post("/:id/transit-flights", 
        // authenticateJWT,
        // Handle multipart/form-data
        (req, res, next) => {
            // Use the existing upload instance from the class
            this.upload(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err) {
                        console.error('File upload error:', err);
                        return res.status(400).json({
                            success: false,
                            message: 'خطأ في رفع الملف',
                            error: err.message
                        });
                    }
                    // Set default values for all fields
                    const now = new Date();
                    const defaultValues = {
                        departureCity: '',
                        arrivalCity: '',
                        departureIata: '',
                        arrivalIata: '',
                        departureTime: now.toISOString(),
                        arrivalTime: now.toISOString(),
                        duration: 0,
                        status: 'true', // As string for form-data
                        airlineId: '',
                        flightNumber: '',
                        price: '0',
                        currency: 'AED',
                        numberOfStops: '0',
                        availableSeats: '0',
                        departureTerminal: '',
                        arrivalTerminal: '',
                        clientId: '',
                        name: '',
                        rating: '0',
                        aircraftType: '',
                        seatLayout: '',
                        seatPitch: '',
                        seats: '[]',
                        // File will be handled separately
                    };
                    // Merge form data with default values
                    const formData = Object.assign(Object.assign({}, defaultValues), req.body);
                    // If file was uploaded, add its path to the form data
                    if (req.file) {
                        formData.aircraftImage = `/uploads/flights/${req.file.filename}`;
                    }
                    else {
                        formData.aircraftImage = '';
                    }
                    // Parse seats if it's a string (from form-data)
                    if (typeof formData.seats === 'string') {
                        try {
                            formData.seats = JSON.parse(formData.seats);
                        }
                        catch (e) {
                            formData.seats = [];
                        }
                    }
                    // Convert string booleans to actual booleans
                    if (formData.status) {
                        formData.status = formData.status === 'true';
                    }
                    // Convert string numbers to actual numbers
                    const numberFields = ['duration', 'price', 'numberOfStops', 'availableSeats', 'rating'];
                    numberFields.forEach(field => {
                        if (formData[field] !== undefined) {
                            formData[field] = parseFloat(formData[field]) || 0;
                        }
                    });
                    // Update request body with processed data
                    req.body = formData;
                    // Validate required fields
                    const requiredFields = [
                        'departureCity', 'arrivalCity', 'departureIata',
                        'arrivalIata', 'departureTime', 'arrivalTime',
                        'airlineId', 'flightNumber', 'price'
                    ];
                    const missingFields = requiredFields.filter(field => !req.body[field]);
                    if (missingFields.length > 0) {
                        return res.status(400).json({
                            success: false,
                            message: `الحقول المطلوبة ناقصة: ${missingFields.join(', ')}`
                        });
                    }
                    // Call the controller method
                    yield this.flightController.addTransitFlight(req, res, next);
                }
                catch (error) {
                    console.error('Error in transit flight route:', error);
                    if (error instanceof Error) {
                        next(error);
                    }
                    else {
                        next(new Error('An unknown error occurred'));
                    }
                }
            }));
        });
        this.router.post("/:id/return-flights", 
        // authenticateJWT,
        // Handle multipart/form-data
        (req, res, next) => {
            // Use the existing upload instance from the class
            this.upload(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err) {
                        console.error('File upload error:', err);
                        return res.status(400).json({
                            success: false,
                            message: 'خطأ في رفع الملف',
                            error: err.message
                        });
                    }
                    // Set default values for all fields
                    const now = new Date();
                    const defaultValues = {
                        departureCity: '',
                        arrivalCity: '',
                        departureIata: '',
                        arrivalIata: '',
                        departureTime: now.toISOString(),
                        arrivalTime: now.toISOString(),
                        duration: 0,
                        status: 'true', // As string for form-data
                        airlineId: '',
                        flightNumber: '',
                        price: '0',
                        currency: 'AED',
                        numberOfStops: '0',
                        availableSeats: '0',
                        departureTerminal: '',
                        arrivalTerminal: '',
                        clientId: '',
                        name: '',
                        rating: '0',
                        aircraftType: '',
                        seatLayout: '',
                        seatPitch: '',
                        seats: '[]',
                        // File will be handled separately
                    };
                    // Merge form data with default values
                    const formData = Object.assign(Object.assign({}, defaultValues), req.body);
                    // If file was uploaded, add its path to the form data
                    if (req.file) {
                        formData.aircraftImage = `/uploads/flights/${req.file.filename}`;
                    }
                    else {
                        formData.aircraftImage = '';
                    }
                    // Parse seats if it's a string (from form-data)
                    if (typeof formData.seats === 'string') {
                        try {
                            formData.seats = JSON.parse(formData.seats);
                        }
                        catch (e) {
                            formData.seats = [];
                        }
                    }
                    // Convert string booleans to actual booleans
                    if (formData.status) {
                        formData.status = formData.status === 'true';
                    }
                    // Convert string numbers to actual numbers
                    const numberFields = ['duration', 'price', 'numberOfStops', 'availableSeats', 'rating'];
                    numberFields.forEach(field => {
                        if (formData[field] !== undefined) {
                            formData[field] = parseFloat(formData[field]) || 0;
                        }
                    });
                    // Update request body with processed data
                    req.body = formData;
                    // Validate required fields
                    const requiredFields = [
                        'departureCity', 'arrivalCity', 'departureIata',
                        'arrivalIata', 'departureTime', 'arrivalTime',
                        'airlineId', 'flightNumber', 'price'
                    ];
                    const missingFields = requiredFields.filter(field => !req.body[field]);
                    if (missingFields.length > 0) {
                        return res.status(400).json({
                            success: false,
                            message: `الحقول المطلوبة ناقصة: ${missingFields.join(', ')}`
                        });
                    }
                    // Call the controller method
                    yield this.flightController.addReturnFlight(req, res, next);
                }
                catch (error) {
                    console.error('Error in return flight route:', error);
                    if (error instanceof Error) {
                        next(error);
                    }
                    else {
                        next(new Error('An unknown error occurred'));
                    }
                }
            }));
        });
        // Remove a transit flight from a flight
        this.router.delete("/:id/transit-flights/:transitFlightId", AuthMiddleware_1.authenticateJWT, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.flightController.removeTransitFlight(req, res, next);
            }
            catch (error) {
                next(error);
            }
        }));
    }
};
exports.FlightRoutes = FlightRoutes;
exports.FlightRoutes = FlightRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.FlightController)),
    __metadata("design:paramtypes", [FlightController_1.FlightController])
], FlightRoutes);
