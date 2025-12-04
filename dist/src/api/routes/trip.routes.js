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
exports.TripRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const inversify_1 = require("inversify");
const TripController_1 = require("../controllers/TripController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const types_1 = require("../../shared/di/types");
let TripRoutes = class TripRoutes {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.router = (0, express_1.Router)();
        this.storage = multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                const uploadDir = "uploads/trip/";
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = path_1.default.extname(file.originalname);
                cb(null, uniqueSuffix + ext);
            },
        });
        this.ratingUpload = (0, multer_1.default)({
            storage: multer_1.default.diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = "uploads/trip/ratings/";
                    fs_1.default.mkdirSync(uploadDir, { recursive: true });
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    const ext = path_1.default.extname(file.originalname);
                    cb(null, uniqueSuffix + ext);
                },
            }),
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB per file
                files: 5,
            },
            fileFilter: (req, file, cb) => {
                const allowed = ["image/jpeg", "image/png", "image/webp"];
                if (allowed.includes(file.mimetype))
                    return cb(null, true);
                return cb(new Error("Invalid file type. Only images are allowed."));
            },
        });
        this.upload = (0, multer_1.default)({
            storage: this.storage,
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB per file
                files: 10,
            },
            fileFilter: (req, file, cb) => {
                const allowed = ["image/jpeg", "image/png", "image/webp"];
                if (allowed.includes(file.mimetype))
                    return cb(null, true);
                return cb(new Error("Invalid file type. Only images are allowed."));
            },
        });
        this.router.post("/", AuthMiddleware_1.authenticateJWT, this.upload.array("images", 10), ...this.ctrl.create);
        this.router.put("/:id", AuthMiddleware_1.authenticateJWT, this.upload.array("images", 10), ...this.ctrl.update);
        this.router.get("/", ...this.ctrl.list);
        this.router.get("/:id", this.ctrl.get);
        this.router.delete("/:id", AuthMiddleware_1.authenticateJWT, this.ctrl.delete);
        this.router.delete("/:id/schedule/:schedId", AuthMiddleware_1.authenticateJWT, this.ctrl.removeSchedule);
        this.router.delete("/:id/images/:imageId", AuthMiddleware_1.authenticateJWT, this.ctrl.removeImage);
        this.router.delete("/:id/hotels/:linkId", AuthMiddleware_1.authenticateJWT, this.ctrl.removeHotel);
        this.router.delete("/:id/flights/:linkId", AuthMiddleware_1.authenticateJWT, this.ctrl.removeFlight);
        // Ratings
        this.router.post("/:id/ratings", AuthMiddleware_1.authenticateJWT, this.ratingUpload.array("images", 5), this.ctrl.addRating);
        this.router.delete("/:id/ratings/:ratingId", AuthMiddleware_1.authenticateJWT, this.ctrl.removeRating);
    }
};
exports.TripRoutes = TripRoutes;
exports.TripRoutes = TripRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TripController)),
    __metadata("design:paramtypes", [TripController_1.TripController])
], TripRoutes);
