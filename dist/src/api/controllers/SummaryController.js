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
exports.SummaryController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/di/types");
const SummaryService_1 = require("../../application/services/SummaryService");
const validation_middleware_1 = require("../middleware/validation.middleware");
const SummaryFilter_dto_1 = require("../../application/dto/SummaryFilter.dto");
let SummaryController = class SummaryController {
    constructor(svc) {
        this.svc = svc;
        this.get = [
            (0, validation_middleware_1.validationMiddleware)(SummaryFilter_dto_1.SummaryFilterSchema, "query"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const filters = SummaryFilter_dto_1.SummaryFilterSchema.parse(req.query);
                    const data = yield this.svc.getSummary(filters);
                    res.json(data);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
    }
};
exports.SummaryController = SummaryController;
exports.SummaryController = SummaryController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.SummaryService)),
    __metadata("design:paramtypes", [SummaryService_1.SummaryService])
], SummaryController);
