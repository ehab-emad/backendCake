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
exports.EmployeeService = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const NotFoundException_1 = require("../exceptions/NotFoundException");
const AuthService_1 = require("./AuthService");
const types_1 = require("../../shared/di/types");
const Employee_model_1 = require("../../infrastructure/database/models/Employee.model");
const EmployeeImage_model_1 = require("../../infrastructure/database/models/EmployeeImage.model");
const Auth_model_1 = require("../../infrastructure/database/models/Auth.model");
let EmployeeService = class EmployeeService {
    constructor(empRepo, imgRepo, authSvc, authRepo, dataSource) {
        this.empRepo = empRepo;
        this.imgRepo = imgRepo;
        this.authSvc = authSvc;
        this.authRepo = authRepo;
        this.dataSource = dataSource;
    }
    createEmployee(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeId = (0, uuid_1.v4)();
            let authUserId;
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const authRepo = manager.getRepository(Auth_model_1.AuthEntity);
                if (dto.email && dto.password) {
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const hash = yield bcrypt_1.default.hash(dto.password, salt);
                    const authUser = yield authRepo.save({
                        id: (0, uuid_1.v4)(),
                        email: dto.email,
                        passwordHash: hash,
                        phoneNumber: undefined,
                        provider: "local",
                        providerId: undefined,
                        phoneVerified: false,
                    });
                    authUserId = authUser.id;
                }
                else if (dto.phoneNumber) {
                    let authUser = yield authRepo.findOneBy({
                        phoneNumber: dto.phoneNumber,
                    });
                    if (!authUser) {
                        authUser = yield authRepo.save({
                            id: (0, uuid_1.v4)(),
                            email: undefined,
                            passwordHash: undefined,
                            phoneNumber: dto.phoneNumber,
                            provider: "phone",
                            providerId: undefined,
                            phoneVerified: false,
                        });
                    }
                    authUserId = authUser.id;
                }
                else {
                    throw new Error("Either (email+password) or phoneNumber is required");
                }
                yield manager.getRepository(Employee_model_1.EmployeeEntity).save({
                    id: employeeId,
                    authUserId,
                    address: (_a = dto.address) !== null && _a !== void 0 ? _a : null,
                    profileImage: (_b = dto.profileImage) !== null && _b !== void 0 ? _b : null,
                    role: dto.role,
                    active: (_c = dto.active) !== null && _c !== void 0 ? _c : true,
                });
                if (dto.images && dto.images.length) {
                    const imgRepo = manager.getRepository(EmployeeImage_model_1.EmployeeImageEntity);
                    for (const path of dto.images) {
                        yield imgRepo.save({
                            id: (0, uuid_1.v4)(),
                            employeeId,
                            path,
                        });
                    }
                }
            }));
            return this.getEmployee(employeeId);
        });
    }
    getEmployee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const e = yield this.empRepo.findById(id);
            if (!e)
                throw new Error("Employee not found");
            e.images = yield this.imgRepo.listForEmployee(id);
            return e;
        });
    }
    updateEmployee(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield manager.getRepository(Employee_model_1.EmployeeEntity).update(id, {
                    address: dto.address,
                    profileImage: dto.profileImage,
                    role: dto.role,
                    active: dto.active,
                });
                if (dto.newImages) {
                    const imgRepo = manager.getRepository(EmployeeImage_model_1.EmployeeImageEntity);
                    for (const path of dto.newImages) {
                        yield imgRepo.save({
                            id: (0, uuid_1.v4)(),
                            employeeId: id,
                            path,
                        });
                    }
                }
            }));
            return this.getEmployee(id);
        });
    }
    findByAuthUserId(authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const partial = yield this.empRepo.findByAuthUserId(authUserId);
            if (!partial)
                throw new NotFoundException_1.NotFoundException("Employee not found");
            return this.getEmployee(partial.id);
        });
    }
    deleteEmployee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.empRepo.findById(id);
            if (!employee) {
                throw new NotFoundException_1.NotFoundException("Employee not found");
            }
            yield this.empRepo.delete(id);
            yield this.authRepo.delete(employee.authUserId);
        });
    }
    removeImage(employeeId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.imgRepo.removeById(imageId);
            return this.imgRepo.listForEmployee(employeeId);
        });
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.EmployeeImageRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.AuthService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.AuthRepository)),
    __param(4, (0, inversify_1.inject)("DataSource")),
    __metadata("design:paramtypes", [Object, Object, AuthService_1.AuthService, Object, Function])
], EmployeeService);
