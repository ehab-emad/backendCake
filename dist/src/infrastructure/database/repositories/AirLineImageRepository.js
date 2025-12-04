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
exports.AirLineImageRepository = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const database_config_1 = require("../../config/database.config");
const AirLineImage_model_1 = require("../models/AirLineImage.model");
const AirLineImage_1 = require("../../../core/entities/AirLineImage");
let AirLineImageRepository = class AirLineImageRepository {
    constructor() {
        this.repo = database_config_1.AppDataSource.getRepository(AirLineImage_model_1.AirLineImageEntity);
    }
    listForLine(airLineId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ents = yield this.repo.find({
                where: { airLineId },
                order: { createdAt: "ASC" },
            });
            return ents.map((e) => new AirLineImage_1.AirLineImage(e.id, e.airLineId, e.path));
        });
    }
    add(airLineId, imagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = this.repo.create({
                id: (0, uuid_1.v4)(),
                airLineId,
                path: imagePath,
            });
            const saved = yield this.repo.save(ent);
            return new AirLineImage_1.AirLineImage(saved.id, saved.airLineId, saved.path);
        });
    }
    removeById(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(imageId);
        });
    }
};
exports.AirLineImageRepository = AirLineImageRepository;
exports.AirLineImageRepository = AirLineImageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], AirLineImageRepository);
