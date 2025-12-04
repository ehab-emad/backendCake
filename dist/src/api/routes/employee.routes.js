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
exports.EmployeeRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const inversify_1 = require("inversify");
const EmployeeController_1 = require("../controllers/EmployeeController");
const types_1 = require("../../shared/di/types");
const validation_middleware_1 = require("../middleware/validation.middleware");
const CreateEmployee_dto_1 = require("../../application/dto/CreateEmployee.dto");
const UpdateEmployee_dto_1 = require("../../application/dto/UpdateEmployee.dto");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
let EmployeeRoutes = class EmployeeRoutes {
    constructor(controller) {
        this.controller = controller;
        this.router = (0, express_1.Router)();
        this.upload = (0, multer_1.default)({ dest: "uploads/employees/" }).fields([
            { name: "profileImage", maxCount: 1 },
            { name: "images", maxCount: 10 },
        ]);
        this.router.post("/", AuthMiddleware_1.authenticateJWT, this.upload, (0, validation_middleware_1.validationMiddleware)(CreateEmployee_dto_1.CreateEmployeeSchema), (req, res, next) => {
            var _a, _b;
            const files = req.files;
            const dto = req.body;
            if ((_a = files === null || files === void 0 ? void 0 : files.profileImage) === null || _a === void 0 ? void 0 : _a[0]) {
                dto.profileImage = files.profileImage[0].path;
            }
            if ((_b = files === null || files === void 0 ? void 0 : files.images) === null || _b === void 0 ? void 0 : _b.length) {
                dto.images = files.images.map((f) => f.path);
            }
            this.controller.createEmployee(req, res, next).catch(next);
        });
        // this.router.get(
        //   "/",
        //   authenticateJWT,
        //   (req: Request, res: Response, next: NextFunction) =>
        //     this.controller.listEmployees(req, res, next).catch(next)
        // );
        this.router.get("/:id", AuthMiddleware_1.authenticateJWT, (req, res, next) => this.controller.getEmployee(req, res, next).catch(next));
        this.router.put("/:id", AuthMiddleware_1.authenticateJWT, this.upload, (0, validation_middleware_1.validationMiddleware)(UpdateEmployee_dto_1.UpdateEmployeeSchema), (req, res, next) => {
            var _a, _b;
            const files = req.files;
            const dto = req.body;
            if ((_a = files === null || files === void 0 ? void 0 : files.profileImage) === null || _a === void 0 ? void 0 : _a[0]) {
                dto.profileImage = files.profileImage[0].path;
            }
            if ((_b = files === null || files === void 0 ? void 0 : files.images) === null || _b === void 0 ? void 0 : _b.length) {
                dto.newImages = files.images.map((f) => f.path);
            }
            this.controller.updateEmployee(req, res, next).catch(next);
        });
        this.router.delete("/:id", AuthMiddleware_1.authenticateJWT, (req, res, next) => this.controller.deleteEmployee(req, res, next).catch(next));
        this.router.delete("/:id/images/:imageId", AuthMiddleware_1.authenticateJWT, (req, res, next) => this.controller.removeImage(req, res, next).catch(next));
    }
};
exports.EmployeeRoutes = EmployeeRoutes;
exports.EmployeeRoutes = EmployeeRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeController)),
    __metadata("design:paramtypes", [EmployeeController_1.EmployeeController])
], EmployeeRoutes);
