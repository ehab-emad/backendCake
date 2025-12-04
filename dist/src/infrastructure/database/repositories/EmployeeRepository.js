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
exports.EmployeeRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Employee_model_1 = require("../models/Employee.model");
const Employee_1 = require("../../../core/entities/Employee");
let EmployeeRepository = class EmployeeRepository {
    constructor() {
        this.repo = database_config_1.AppDataSource.getRepository(Employee_model_1.EmployeeEntity);
    }
    create(emp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const ent = this.repo.create({
                id: emp.id,
                authUserId: emp.authUserId,
                role: emp.role,
                active: emp.active,
                address: (_a = emp.address) !== null && _a !== void 0 ? _a : undefined,
                profileImage: (_b = emp.profileImage) !== null && _b !== void 0 ? _b : undefined,
            });
            yield this.repo.save(ent);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const e = yield this.repo.findOneBy({ id });
            if (!e)
                return null;
            return new Employee_1.Employee(e.id, e.authUserId, (_a = e.address) !== null && _a !== void 0 ? _a : null, e.role, e.active, (_b = e.profileImage) !== null && _b !== void 0 ? _b : undefined);
        });
    }
    findByAuthUserId(authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const e = yield this.repo.findOneBy({ authUserId });
            if (!e)
                return null;
            return new Employee_1.Employee(e.id, e.authUserId, (_a = e.address) !== null && _a !== void 0 ? _a : null, e.role, e.active, (_b = e.profileImage) !== null && _b !== void 0 ? _b : undefined);
        });
    }
    update(emp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield this.repo.update(emp.id, {
                role: emp.role,
                active: emp.active,
                address: (_a = emp.address) !== null && _a !== void 0 ? _a : undefined,
                profileImage: (_b = emp.profileImage) !== null && _b !== void 0 ? _b : undefined,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
};
exports.EmployeeRepository = EmployeeRepository;
exports.EmployeeRepository = EmployeeRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], EmployeeRepository);
