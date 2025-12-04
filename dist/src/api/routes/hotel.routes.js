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
exports.HotelRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const HotelController_1 = require("../controllers/HotelController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const FilterHotel_dto_1 = require("../../application/dto/FilterHotel.dto");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let HotelRoutes = class HotelRoutes {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.router = (0, express_1.Router)();
        // Multer للفندق: صور + خريطة
        this.hotelUpload = (0, multer_1.default)({
            storage: multer_1.default.diskStorage({
                destination: (req, file, cb) => {
                    let uploadDir = "";
                    if (file.fieldname === "images")
                        uploadDir = "uploads/hotels/images/";
                    else if (file.fieldname === "map")
                        uploadDir = "uploads/hotels/map/";
                    fs_1.default.mkdirSync(uploadDir, { recursive: true });
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    const ext = path_1.default.extname(file.originalname);
                    if (file.fieldname === "map")
                        cb(null, "map-" + uniqueSuffix + ext);
                    else
                        cb(null, uniqueSuffix + ext);
                },
            }),
            limits: { fileSize: 20 * 1024 * 1024 }, // أكبر حجم 20MB
            fileFilter: (req, file, cb) => {
                const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
                if (allowedTypes.includes(file.mimetype))
                    cb(null, true);
                else
                    cb(new Error("Invalid file type. Only images are allowed."));
            },
        }).fields([
            { name: "images", maxCount: 10 }, // صور الفندق
            { name: "map", maxCount: 1 }, // خريطة الفندق
        ]);
        // Multer للتقييم: صور فقط
        this.ratingUpload = (0, multer_1.default)({
            storage: multer_1.default.diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = "uploads/ratings/";
                    fs_1.default.mkdirSync(uploadDir, { recursive: true });
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    const ext = path_1.default.extname(file.originalname);
                    cb(null, uniqueSuffix + ext);
                },
            }),
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB لكل صورة
            fileFilter: (req, file, cb) => {
                const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
                if (allowedTypes.includes(file.mimetype))
                    cb(null, true);
                else
                    cb(new Error("Invalid file type. Only images are allowed."));
            },
        }).array("images", 5); // صور التقييم
        this.configureRoutes();
    }
    configureRoutes() {
        const hotelUploadMiddleware = (req, res, next) => {
            this.hotelUpload(req, res, (err) => {
                if (err)
                    return next(err);
                next();
            });
        };
        const ratingUploadMiddleware = (req, res, next) => {
            this.ratingUpload(req, res, (err) => {
                if (err)
                    return next(err);
                next();
            });
        };
        // إنشاء فندق
        this.router.post("/", AuthMiddleware_1.authenticateJWT, hotelUploadMiddleware, ...this.ctrl.create);
        // تعديل فندق
        this.router.put("/:id", AuthMiddleware_1.authenticateJWT, hotelUploadMiddleware, ...this.ctrl.update);
        // جلب قائمة الفنادق
        this.router.get("/", (0, validation_middleware_1.validationMiddleware)(FilterHotel_dto_1.FilterHotelSchema, "query"), ...this.ctrl.list);
        // جلب فندق واحد
        this.router.get("/:id", ...this.ctrl.get);
        this.router.put("/:id", AuthMiddleware_1.authenticateJWT, hotelUploadMiddleware, ...this.ctrl.update);
        this.router.delete("/:id", AuthMiddleware_1.authenticateJWT, ...this.ctrl.delete);
        // إضافة تقييم
        this.router.post("/:id/ratings", AuthMiddleware_1.authenticateJWT, ratingUploadMiddleware, (req, res, next) => {
            this.ctrl.addRating(req, res, next).catch(next);
        });
        // حذف فندق
        this.router.delete("/:id", AuthMiddleware_1.authenticateJWT, ...this.ctrl.delete);
        // حذف صورة
        this.router.delete("/:id/images/:imageId", AuthMiddleware_1.authenticateJWT, ...this.ctrl.removeImage);
    }
};
exports.HotelRoutes = HotelRoutes;
exports.HotelRoutes = HotelRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.HotelController)),
    __metadata("design:paramtypes", [HotelController_1.HotelController])
], HotelRoutes);
