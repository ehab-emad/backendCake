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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirLineMealService = void 0;
const inversify_1 = require("inversify");
const ConflictError_1 = require("../exceptions/ConflictError");
const types_1 = require("../../shared/di/types");
let AirLineMealService = class AirLineMealService {
    constructor(repo) {
        this.repo = repo;
    }
    listMeals(airLineId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.listForLine(airLineId);
        });
    }
    addMeal(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.repo.listForLine(dto.airLineId);
            if (existing.some((m) => m.name === dto.name)) {
                throw new ConflictError_1.ConflictError("Meal already exists for this air line");
            }
            yield this.repo.add(dto.airLineId, dto.name);
            return this.repo.listForLine(dto.airLineId);
        });
    }
    removeMeal(airLineId, mealId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.removeById(mealId);
            return this.repo.listForLine(airLineId);
        });
    }
};
exports.AirLineMealService = AirLineMealService;
exports.AirLineMealService = AirLineMealService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AirLineMealRepository)),
    __metadata("design:paramtypes", [Object])
], AirLineMealService);
