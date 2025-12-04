"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.TripController = void 0;
const fs = __importStar(require("fs"));
const inversify_1 = require("inversify");
const CreateTrip_dto_1 = require("../../application/dto/CreateTrip.dto");
const UpdateTrip_dto_1 = require("../../application/dto/UpdateTrip.dto");
const FilterTrip_dto_1 = require("../../application/dto/FilterTrip.dto");
const TripService_1 = require("../../application/services/TripService");
const types_1 = require("../../shared/di/types");
const validation_middleware_1 = require("../middleware/validation.middleware");
let TripController = class TripController {
    constructor(svc) {
        this.svc = svc;
        this.create = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Normalize form-data fields that might arrive as strings
                    const body = Object.assign({}, req.body);
                    const parseJSON = (val) => {
                        if (val === undefined || val === null)
                            return undefined;
                        if (Array.isArray(val))
                            return val;
                        if (typeof val === "string") {
                            const trimmed = val.trim();
                            // If it's clearly JSON, try to parse
                            if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
                                try {
                                    return JSON.parse(trimmed);
                                }
                                catch (_a) {
                                    return val;
                                }
                            }
                            return val;
                        }
                        return val;
                    };
                    // schedule can be sent as a single object or an array (as JSON string)
                    const rawSchedule = parseJSON(body.schedule);
                    if (rawSchedule !== undefined) {
                        if (Array.isArray(rawSchedule))
                            body.schedule = rawSchedule;
                        else if (typeof rawSchedule === "object")
                            body.schedule = [rawSchedule];
                        else {
                            // If user sent plain string, try parse one more time as object
                            try {
                                const asObj = JSON.parse(rawSchedule);
                                body.schedule = Array.isArray(asObj) ? asObj : [asObj];
                            }
                            catch (_a) {
                                // leave undefined so Zod optional will pass
                                delete body.schedule;
                            }
                        }
                    }
                    // hotels/flights can be JSON arrays, comma-separated, or single string
                    const normalizeIdArray = (val) => {
                        const parsed = parseJSON(val);
                        if (parsed === undefined)
                            return undefined;
                        if (Array.isArray(parsed))
                            return parsed;
                        if (typeof parsed === "string") {
                            if (parsed.includes(","))
                                return parsed.split(",").map(s => s.trim()).filter(Boolean);
                            return [parsed];
                        }
                        return [parsed];
                    };
                    const hotels = normalizeIdArray(body.hotels);
                    const flights = normalizeIdArray(body.flights);
                    if (hotels)
                        body.hotels = hotels;
                    if (flights)
                        body.flights = flights;
                    // Map uploaded files to body.images
                    const uploadedFiles = req.files;
                    if (uploadedFiles && uploadedFiles.length > 0) {
                        body.images = uploadedFiles.map((f) => f.path);
                    }
                    // Validate the request body
                    const dto = CreateTrip_dto_1.CreateTripSchema.parse(body);
                    // Custom validation for images - require at least 5 images
                    if (!body.images || body.images.length < 5) {
                        // Clean up any uploaded files if validation fails
                        if (uploadedFiles && uploadedFiles.length > 0) {
                            uploadedFiles.forEach(file => {
                                try {
                                    fs.unlinkSync(file.path);
                                }
                                catch (error) {
                                    console.error('Error cleaning up file:', file.path, error);
                                }
                            });
                        }
                        throw new Error('يجب إضافة 5 صور على الأقل');
                    }
                    const trip = yield this.svc.createTrip(dto);
                    res.status(201).json(trip);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.list = [
            (0, validation_middleware_1.validationMiddleware)(FilterTrip_dto_1.FilterTripSchema, "query"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Parse query parameters with proper type conversion
                    const queryParams = Object.assign({}, req.query);
                    // Convert string values to numbers where applicable
                    const numericFields = ['minRating', 'maxRating', 'minPrice', 'maxPrice', 'page', 'limit'];
                    numericFields.forEach(field => {
                        if (queryParams[field] !== undefined) {
                            queryParams[field] = Number(queryParams[field]);
                        }
                    });
                    // Validate and parse the filters
                    const filters = FilterTrip_dto_1.FilterTripSchema.parse(queryParams);
                    // Log the filters for debugging
                    console.log('Fetching trips with filters:', JSON.stringify(filters, null, 2));
                    // Get the filtered trips
                    const result = yield this.svc.listTrips(filters);
                    // Format the response
                    res.json({
                        success: true,
                        data: result.data,
                        meta: {
                            total: result.total,
                            page: result.page,
                            limit: result.limit,
                            totalPages: Math.ceil(result.total / result.limit)
                        }
                    });
                }
                catch (err) {
                    console.error('Error in TripController.list:', err);
                    next(err);
                }
            }),
        ];
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const trip = yield this.svc.getTrip(req.params.id);
                res.json(trip);
            }
            catch (err) {
                next(err);
            }
        });
        this.update = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const id = req.params.id;
                    const body = Object.assign({}, req.body);
                    // 🔹 Helper to safely parse JSON fields
                    const parseJSON = (val) => {
                        if (val === undefined || val === null)
                            return undefined;
                        if (Array.isArray(val))
                            return val;
                        if (typeof val === "string") {
                            const trimmed = val.trim();
                            if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
                                (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
                                try {
                                    return JSON.parse(trimmed);
                                }
                                catch (_a) {
                                    return val;
                                }
                            }
                            return val;
                        }
                        return val;
                    };
                    // 🔹 Normalize schedule
                    const rawSchedule = parseJSON(body.schedule);
                    if (rawSchedule !== undefined) {
                        if (Array.isArray(rawSchedule))
                            body.schedule = rawSchedule;
                        else if (typeof rawSchedule === "object")
                            body.schedule = [rawSchedule];
                        else {
                            try {
                                const asObj = JSON.parse(rawSchedule);
                                body.schedule = Array.isArray(asObj) ? asObj : [asObj];
                            }
                            catch (_a) {
                                delete body.schedule;
                            }
                        }
                    }
                    // 🔹 Normalize hotels and flights (could be comma-separated, single, or array)
                    const normalizeIdArray = (val) => {
                        const parsed = parseJSON(val);
                        if (parsed === undefined)
                            return undefined;
                        if (Array.isArray(parsed))
                            return parsed;
                        if (typeof parsed === "string") {
                            if (parsed.includes(",")) {
                                return parsed.split(",").map((s) => s.trim()).filter(Boolean);
                            }
                            return [parsed];
                        }
                        return [parsed];
                    };
                    const hotels = normalizeIdArray(body.hotels);
                    const flights = normalizeIdArray(body.flights);
                    if (hotels)
                        body.hotels = hotels;
                    if (flights)
                        body.flights = flights;
                    // 🔹 Handle uploaded images
                    const uploadedFiles = req.files;
                    if (uploadedFiles && uploadedFiles.length > 0) {
                        body.newImages = uploadedFiles.map((f) => f.path);
                    }
                    // 🔹 Validate using Zod
                    const result = UpdateTrip_dto_1.UpdateTripSchema.safeParse(body);
                    if (!result.success) {
                        // Clean up uploaded files if validation fails
                        if (uploadedFiles && uploadedFiles.length > 0) {
                            uploadedFiles.forEach((f) => {
                                try {
                                    fs.unlinkSync(f.path);
                                }
                                catch (err) {
                                    console.error("Error removing uploaded file:", f.path, err);
                                }
                            });
                        }
                        const formatted = result.error.issues.map((e) => {
                            var _a, _b;
                            return ({
                                code: e.code,
                                path: e.path,
                                message: e.message,
                                expected: (_a = e === null || e === void 0 ? void 0 : e.expected) !== null && _a !== void 0 ? _a : null,
                                received: (_b = e === null || e === void 0 ? void 0 : e.received) !== null && _b !== void 0 ? _b : null,
                            });
                        });
                        res.status(400).json({ error: { message: JSON.stringify(formatted, null, 2) } });
                    }
                    const dto = result.data;
                    if (!dto) {
                        res.status(400).json({ error: { message: "Invalid data provided" } });
                        return;
                    }
                    // 🔹 Call service to update
                    const updatedTrip = yield this.svc.updateTrip(id, dto);
                    res.status(200).json(updatedTrip);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.deleteTrip(req.params.id);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
        this.removeSchedule = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.removeSchedule(req.params.id, req.params.schedId);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
        this.removeImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.removeImage(req.params.id, req.params.imageId);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
        this.removeHotel = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.removeHotel(req.params.id, req.params.linkId);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
        this.removeFlight = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.removeFlight(req.params.id, req.params.linkId);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
        this.addRating = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, comment, rating } = req.body;
                const tripId = req.params.id;
                const ratingValue = Number(rating);
                if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
                    res.status(400).json({ error: 'Rating must be a valid number between 1 and 5' });
                    return;
                }
                const images = [];
                if (req.files && Array.isArray(req.files)) {
                    images.push(...req.files.map((f) => f.path));
                }
                else if (req.file) {
                    images.push(req.file.path);
                }
                const result = yield this.svc.addRating(tripId, {
                    name,
                    comment,
                    rating: ratingValue,
                    images: images.length > 0 ? images : undefined,
                });
                res.status(201).json(result);
            }
            catch (err) {
                next(err);
            }
        });
        this.removeRating = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.removeRating(req.params.id, req.params.ratingId);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
    }
};
exports.TripController = TripController;
exports.TripController = TripController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TripService)),
    __metadata("design:paramtypes", [TripService_1.TripService])
], TripController);
