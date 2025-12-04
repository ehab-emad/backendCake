"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.EmployeeImageRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const EmployeeImage_model_1 = require("../models/EmployeeImage.model");
const EmployeeImage_1 = require("../../../core/entities/EmployeeImage");
const uuid_1 = require("uuid");
let EmployeeImageRepository = class EmployeeImageRepository {
    constructor() {
        this.repo = database_config_1.AppDataSource.getRepository(EmployeeImage_model_1.EmployeeImageEntity);
    }
    listForEmployee(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({ where: { employeeId } });
            return ents.map((e) => new EmployeeImage_1.EmployeeImage(e.id, e.employeeId, e.path));
        });
    }
    add(employeeId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = this.repo.create({ id: (0, uuid_1.v4)(), employeeId, path });
            const saved = yield this.repo.save(ent);
            return new EmployeeImage_1.EmployeeImage(saved.id, saved.employeeId, saved.path);
        });
    }
    removeById(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(imageId);
        });
    }
};
exports.EmployeeImageRepository = EmployeeImageRepository;
exports.EmployeeImageRepository = EmployeeImageRepository = __decorate([
    (0, inversify_1.injectable)()
], EmployeeImageRepository);
