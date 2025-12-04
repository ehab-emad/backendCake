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
exports.AirLineRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const inversify_1 = require("inversify");
const validation_middleware_1 = require("../middleware/validation.middleware");
const CreateAirLine_dto_1 = require("../../application/dto/CreateAirLine.dto");
const UpdateAirLine_dto_1 = require("../../application/dto/UpdateAirLine.dto");
const FilterAirLine_dto_1 = require("../../application/dto/FilterAirLine.dto");
const types_1 = require("../../shared/di/types");
const AirLineController_1 = require("../controllers/AirLineController");
let AirLineRoutes = class AirLineRoutes {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.router = (0, express_1.Router)();
        this.storage = multer_1.default.diskStorage({
            destination: 'uploads/airlines/',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = require('path').extname(file.originalname);
                cb(null, uniqueSuffix + ext);
            }
        });
        this.upload = (0, multer_1.default)({
            storage: this.storage,
            limits: {
                fileSize: 10 * 1024 * 1024 // 10MB limit
            }
        });
        this.router.post("/", this.upload.array("images", 5), (0, validation_middleware_1.validationMiddleware)(CreateAirLine_dto_1.CreateAirLineSchema, "body"), this.ctrl.create);
        this.router.get("/", (0, validation_middleware_1.validationMiddleware)(FilterAirLine_dto_1.FilterAirLineSchema, "query"), this.ctrl.list);
        this.router.get("/:id", this.ctrl.get);
        this.router.put("/:id", this.upload.array("images", 5), (0, validation_middleware_1.validationMiddleware)(UpdateAirLine_dto_1.UpdateAirLineSchema, "body"), this.ctrl.update);
        this.router.delete("/:id", this.ctrl.delete);
        this.router.delete("/:id/images/:imageId", this.ctrl.removeImage);
        this.router.delete("/:id/features/:featureId", this.ctrl.removeFeature);
        this.router.delete("/:id/meals/:mealId", this.ctrl.removeMeal);
    }
};
exports.AirLineRoutes = AirLineRoutes;
exports.AirLineRoutes = AirLineRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AirLineController)),
    __metadata("design:paramtypes", [AirLineController_1.AirLineController])
], AirLineRoutes);
