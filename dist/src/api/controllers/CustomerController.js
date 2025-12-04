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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const inversify_1 = require("inversify");
const CustomerService_1 = require("../../application/services/CustomerService");
const AuthService_1 = require("../../application/services/AuthService");
const types_1 = require("../../shared/di/types");
const BaseController_1 = require("./BaseController");
const validation_middleware_1 = require("../middleware/validation.middleware");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const FilterCustomer_dto_1 = require("../../application/dto/FilterCustomer.dto");
const CreateCustomer_dto_1 = require("../../application/dto/CreateCustomer.dto");
const RegisterAndProfile_dto_1 = require("../../application/dto/RegisterAndProfile.dto");
const zod_1 = require("zod");
// إضافة schema للـ favorites
const FavoriteItemSchema = zod_1.z.object({
    type: zod_1.z.enum(["flight", "hotel", "package", "trip"]),
    id: zod_1.z.string(),
});
let CustomerController = class CustomerController extends BaseController_1.BaseController {
    constructor(service, authRepo, authService) {
        super();
        this.service = service;
        this.authRepo = authRepo;
        this.authService = authService;
        this.create = [
            (0, validation_middleware_1.validationMiddleware)(RegisterAndProfile_dto_1.RegisterAndProfileSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const _a = req.body, { firstName, lastName, email, password } = _a, profile = __rest(_a, ["firstName", "lastName", "email", "password"]);
                    const user = yield this.authService.register(firstName, lastName, email, password);
                    // If a file was uploaded, add its path to the profile data
                    if (req.file) {
                        profile.profilePicture = `/uploads/customers/profile-pictures/${req.file.filename}`;
                    }
                    const dto = CreateCustomer_dto_1.CreateCustomerSchema.parse(Object.assign(Object.assign({ authUserId: user.id }, profile), { email }));
                    try {
                        const customer = yield this.service.createCustomer(user.id, dto);
                        res.status(201).json(customer);
                    }
                    catch (error) {
                        // If customer creation fails, delete the uploaded file
                        if (req.file) {
                            const filePath = path_1.default.join(process.cwd(), 'uploads/customers/profile-pictures', req.file.filename);
                            if (fs_1.default.existsSync(filePath)) {
                                fs_1.default.unlinkSync(filePath);
                            }
                        }
                        throw error;
                    }
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.update = [
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { customerId } = req.params;
                    const updateData = Object.assign({}, req.body);
                    // If a file was uploaded, add its path to the update data
                    if (req.file) {
                        // The file path is already set by multer in the route
                        updateData.profilePicture = `/uploads/customers/profile-pictures/${req.file.filename}`;
                        // If there was a previous profile picture, delete it
                        const customer = yield this.service.findById(customerId);
                        if (customer === null || customer === void 0 ? void 0 : customer.profilePicture) {
                            const oldImagePath = path_1.default.join(process.cwd(), customer.profilePicture);
                            if (fs_1.default.existsSync(oldImagePath)) {
                                fs_1.default.unlinkSync(oldImagePath);
                            }
                        }
                    }
                    const updated = yield this.service.updateCustomer(customerId, updateData);
                    res.json(updated);
                }
                catch (err) {
                    // If there was an error and a file was uploaded, delete it
                    if (req.file) {
                        const filePath = path_1.default.join(process.cwd(), 'uploads/customers/profile-pictures', req.file.filename);
                        if (fs_1.default.existsSync(filePath)) {
                            fs_1.default.unlinkSync(filePath);
                        }
                    }
                    next(err);
                }
            }),
        ];
        this.getById = [
            AuthMiddleware_1.authenticateJWT,
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    const customer = yield this.service.findById(req.params.customerId);
                    const auth = yield this.authRepo.findById(customer.authUserId);
                    const payload = Object.assign(Object.assign({}, customer), { latitude: customer.latitude, longitude: customer.longitude, nationalId: customer.nationalId, nationalIdExpiry: customer.nationalIdExpiry, authUser: auth && {
                            id: auth.id,
                            firstName: auth.firstName,
                            lastName: auth.lastName,
                            email: auth.email,
                            phoneNumber: (_a = auth.phoneNumber) !== null && _a !== void 0 ? _a : null,
                        } });
                    this.ok(res, payload);
                }
                catch (err) {
                    this.handleError(res, err);
                }
            }),
        ];
        this.getByAuthUser = [
            AuthMiddleware_1.authenticateJWT,
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const customer = yield this.service.findByAuthUserId(req.params.authUserId);
                    this.ok(res, customer);
                }
                catch (err) {
                    this.handleError(res, err);
                }
            }),
        ];
        this.list = [
            AuthMiddleware_1.authenticateJWT,
            (0, validation_middleware_1.validationMiddleware)(FilterCustomer_dto_1.FilterCustomerSchema, "query"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.service.list(req.query);
                    // Enrich customer data with auth user info
                    const enrichedData = yield Promise.all(result.data.map((customer) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const auth = yield this.authRepo.findById(customer.authUserId);
                        return Object.assign(Object.assign({}, customer), { latitude: customer.latitude, longitude: customer.longitude, nationalId: customer.nationalId, nationalIdExpiry: customer.nationalIdExpiry, authUser: auth && {
                                id: auth.id,
                                firstName: auth.firstName,
                                lastName: auth.lastName,
                                email: auth.email,
                                phoneNumber: (_a = auth.phoneNumber) !== null && _a !== void 0 ? _a : null,
                            } });
                    })));
                    this.ok(res, {
                        data: enrichedData,
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                    });
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
                    yield this.service.deleteCustomer(req.params.customerId);
                    res.sendStatus(204);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.upgradeToVIP = [
            AuthMiddleware_1.authenticateJWT,
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const customer = yield this.service.upgradeToVIP(req.params.customerId);
                    this.ok(res, customer);
                }
                catch (err) {
                    this.handleError(res, err);
                }
            }),
        ];
        // دوال المفضلة (Favorites)
        this.addToFavorites = [
            AuthMiddleware_1.authenticateJWT,
            (0, validation_middleware_1.validationMiddleware)(FavoriteItemSchema, "body"),
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { customerId } = req.params;
                    const { type, id } = req.body;
                    const customer = yield this.service.addToFavorites(customerId, type, id);
                    this.ok(res, {
                        message: 'تم إضافة العنصر للمفضلة بنجاح',
                        favorites: customer.favorites
                    });
                }
                catch (err) {
                    this.handleError(res, err);
                }
            }),
        ];
        this.removeFromFavorites = [
            AuthMiddleware_1.authenticateJWT,
            (0, validation_middleware_1.validationMiddleware)(FavoriteItemSchema, "body"),
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { customerId } = req.params;
                    const { type, id } = req.body;
                    const customer = yield this.service.removeFromFavorites(customerId, type, id);
                    this.ok(res, {
                        message: 'تم إزالة العنصر من المفضلة بنجاح',
                        favorites: customer.favorites
                    });
                }
                catch (err) {
                    this.handleError(res, err);
                }
            }),
        ];
        this.getFavorites = [
            AuthMiddleware_1.authenticateJWT,
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { customerId } = req.params;
                    const favorites = yield this.service.getFavorites(customerId);
                    this.ok(res, { favorites });
                }
                catch (err) {
                    this.handleError(res, err);
                }
            }),
        ];
        this.isFavorite = [
            AuthMiddleware_1.authenticateJWT,
            (0, validation_middleware_1.validationMiddleware)(FavoriteItemSchema, "body"),
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { customerId } = req.params;
                    const { type, id } = req.body;
                    const isFavorite = yield this.service.isFavorite(customerId, type, id);
                    this.ok(res, { isFavorite });
                }
                catch (err) {
                    this.handleError(res, err);
                }
            }),
        ];
        this.clearFavorites = [
            AuthMiddleware_1.authenticateJWT,
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { customerId } = req.params;
                    const customer = yield this.service.clearFavorites(customerId);
                    this.ok(res, {
                        message: 'تم مسح جميع المفضلة بنجاح',
                        favorites: customer.favorites
                    });
                }
                catch (err) {
                    this.handleError(res, err);
                }
            }),
        ];
    }
};
exports.CustomerController = CustomerController;
exports.CustomerController = CustomerController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CustomerService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.AuthRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.AuthService)),
    __metadata("design:paramtypes", [CustomerService_1.CustomerService, Object, AuthService_1.AuthService])
], CustomerController);
