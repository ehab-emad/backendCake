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
exports.HotelController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const HotelService_1 = require("../../application/services/HotelService");
const CreateHotel_dto_1 = require("../../application/dto/CreateHotel.dto");
const UpdateHotel_dto_1 = require("../../application/dto/UpdateHotel.dto");
const FilterHotel_dto_1 = require("../../application/dto/FilterHotel.dto");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
let HotelController = class HotelController {
    constructor(svc) {
        this.svc = svc;
        this.create = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    // Parse service items from form-data
                    const serviceFields = ['meals', 'unlimitedInternet', 'airportTransfer'];
                    const serviceData = serviceFields.reduce((acc, field) => (Object.assign(Object.assign({}, acc), { [field]: this.parseServiceItems(req.body, field) })), {});
                    const dto = CreateHotel_dto_1.CreateHotelSchema.parse(Object.assign(Object.assign({}, req.body), serviceData));
                    const files = req.files;
                    if ((_a = files === null || files === void 0 ? void 0 : files.images) === null || _a === void 0 ? void 0 : _a.length) {
                        dto.images = files.images.map((f) => f.path);
                    }
                    if ((_b = files === null || files === void 0 ? void 0 : files.map) === null || _b === void 0 ? void 0 : _b.length) {
                        dto.map = files.map[0].path; // صورة واحدة فقط
                    }
                    const hotel = yield this.svc.createHotel(dto);
                    res.status(201).json(hotel);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.update = [
            AuthMiddleware_1.authenticateJWT,
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                try {
                    // Parse service items from form-data
                    const serviceFields = ['meals', 'unlimitedInternet', 'airportTransfer'];
                    const serviceData = serviceFields.reduce((acc, field) => (Object.assign(Object.assign({}, acc), { [field]: this.parseServiceItems(req.body, field) })), {});
                    const dto = UpdateHotel_dto_1.UpdateHotelSchema.parse(Object.assign(Object.assign(Object.assign({}, req.body), serviceData), { imagesToRemove: req.body.imagesToRemove ? JSON.parse(req.body.imagesToRemove) : [], amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [] }));
                    const files = req.files;
                    if ((_a = files === null || files === void 0 ? void 0 : files.images) === null || _a === void 0 ? void 0 : _a.length) {
                        dto.newImages = files.images.map((file) => file.path);
                    }
                    else {
                        dto.newImages = [];
                    }
                    if ((_b = files === null || files === void 0 ? void 0 : files.map) === null || _b === void 0 ? void 0 : _b.length) {
                        dto.map = files.map[0].path; // تحديث الماب
                    }
                    const updated = yield this.svc.updateHotel(req.params.id, dto);
                    const response = Object.assign(Object.assign({}, updated), { images: ((_c = updated.images) === null || _c === void 0 ? void 0 : _c.map(img => {
                            const normalized = img.path.replace(/\\/g, "/").replace(/^\/+/, "");
                            return Object.assign(Object.assign({}, img), { url: `${normalized}`.replace(/([^:]\/)\/+/g, "$1") });
                        })) || [] });
                    res.status(200).json(response);
                }
                catch (err) {
                    console.error('[HotelController] Error in update:', err);
                    next(err);
                }
            }),
        ];
        this.list = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Parse and validate query parameters
                    const query = req.query;
                    // Convert string values to appropriate types
                    const filters = {};
                    // Handle pagination
                    if (query.page)
                        filters.page = parseInt(query.page, 10);
                    if (query.limit)
                        filters.limit = parseInt(query.limit, 10);
                    // Handle sorting
                    if (query.sortBy)
                        filters.sortBy = query.sortBy;
                    if (query.sortOrder)
                        filters.sortOrder = query.sortOrder;
                    // Handle numeric filters
                    const numericFields = ['minPrice', 'maxPrice', 'minRating', 'maxRating'];
                    numericFields.forEach(field => {
                        if (query[field] !== undefined) {
                            filters[field] = parseFloat(query[field]);
                        }
                    });
                    // Handle string filters
                    const stringFields = ['clientId', 'name', 'location', 'status', 'city'];
                    stringFields.forEach(field => {
                        if (query[field] !== undefined) {
                            filters[field] = query[field];
                        }
                    });
                    // Handle comma-separated lists
                    const listFields = ['amenities', 'roomTypes'];
                    listFields.forEach(field => {
                        if (query[field] !== undefined) {
                            filters[field] = query[field];
                        }
                    });
                    // Validate filters against the schema
                    const validatedFilters = FilterHotel_dto_1.FilterHotelSchema.parse(filters);
                    // Get filtered and paginated results
                    const result = yield this.svc.listHotels(validatedFilters);
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
                    console.error('[HotelController] Error listing hotels:', err);
                    next(err);
                }
            }),
        ];
        this.get = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const hotel = yield this.svc.getHotel(req.params.id);
                    res.json(hotel);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.delete = [
            AuthMiddleware_1.authenticateJWT,
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.svc.deleteHotel(req.params.id);
                    res.sendStatus(204);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.removeImage = [
            AuthMiddleware_1.authenticateJWT,
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { id, imageId } = req.params;
                    const images = yield this.svc.listImages(id);
                    const found = images.find((img) => img.id === imageId);
                    if (!found) {
                        res.status(404).json({ error: "Image not found" });
                        return;
                    }
                    yield promises_1.default.unlink(path_1.default.resolve(found.path)).catch(() => { });
                    const result = yield this.svc.removeImage(id, imageId);
                    res.json(result);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
    }
    parseServiceItems(body, field) {
        if (!body[field])
            return [];
        try {
            return typeof body[field] === 'string' ? JSON.parse(body[field]) : body[field];
        }
        catch (_a) {
            return [];
        }
    }
    addRating(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, comment, rating } = req.body;
                const hotelId = req.params.id;
                // Convert rating to number and validate
                const ratingValue = Number(rating);
                // if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
                //   return res.status(400).json({ error: 'Rating must be a valid number between 1 and 5' });
                // }
                // Handle file uploads if any
                const images = [];
                if (req.files && Array.isArray(req.files)) {
                    images.push(...req.files.map((file) => file.path));
                }
                else if (req.file) {
                    images.push(req.file.path);
                }
                const result = yield this.svc.addRating(hotelId, {
                    name,
                    comment: comment || undefined,
                    rating: ratingValue,
                    images: images.length > 0 ? images : undefined
                });
                res.status(201).json(result);
            }
            catch (err) {
                next(err);
            }
        });
    }
};
exports.HotelController = HotelController;
exports.HotelController = HotelController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.HotelService)),
    __metadata("design:paramtypes", [HotelService_1.HotelService])
], HotelController);
