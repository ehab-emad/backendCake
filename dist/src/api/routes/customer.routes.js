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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const CustomerController_1 = require("../controllers/CustomerController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
let CustomerRoutes = class CustomerRoutes {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.router = (0, express_1.Router)();
        this.storage = multer_1.default.diskStorage({
            destination: "uploads/customers/profile-pictures/",
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path_1.default.extname(file.originalname);
                cb(null, 'profile-' + uniqueSuffix + ext);
            },
        });
        this.upload = (0, multer_1.default)({
            storage: this.storage,
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
            },
            fileFilter: (req, file, cb) => {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                }
                else {
                    cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
                }
            },
        }).single('profilePicture');
        this.router.post("/", AuthMiddleware_1.authenticateJWT, (req, res, next) => {
            this.upload(req, res, (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                next();
            });
        }, ...this.ctrl.create);
        this.router.put("/:customerId", AuthMiddleware_1.authenticateJWT, (req, res, next) => {
            this.upload(req, res, (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                next();
            });
        }, ...this.ctrl.update);
        this.router.get("/:customerId", AuthMiddleware_1.authenticateJWT, ...this.ctrl.getById);
        this.router.get("/auth/:authUserId", AuthMiddleware_1.authenticateJWT, ...this.ctrl.getByAuthUser);
        this.router.get("/", AuthMiddleware_1.authenticateJWT, ...this.ctrl.list);
        this.router.patch("/:customerId/vip", AuthMiddleware_1.authenticateJWT, ...this.ctrl.upgradeToVIP);
        this.router.delete("/:customerId", AuthMiddleware_1.authenticateJWT, ...this.ctrl.delete);
        // Routes للمفضلة (Favorites)
        this.router.post("/:customerId/favorites", AuthMiddleware_1.authenticateJWT, ...this.ctrl.addToFavorites);
        this.router.delete("/:customerId/favorites", AuthMiddleware_1.authenticateJWT, ...this.ctrl.removeFromFavorites);
        this.router.get("/:customerId/favorites", AuthMiddleware_1.authenticateJWT, ...this.ctrl.getFavorites);
        this.router.post("/:customerId/favorites/check", AuthMiddleware_1.authenticateJWT, ...this.ctrl.isFavorite);
        this.router.delete("/:customerId/favorites/all", AuthMiddleware_1.authenticateJWT, ...this.ctrl.clearFavorites);
    }
};
exports.CustomerRoutes = CustomerRoutes;
exports.CustomerRoutes = CustomerRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CustomerController)),
    __metadata("design:paramtypes", [CustomerController_1.CustomerController])
], CustomerRoutes);
