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
exports.RoomController = void 0;
const inversify_1 = require("inversify");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const RoomService_1 = require("../../application/services/RoomService");
const HotelService_1 = require("../../application/services/HotelService");
const types_1 = require("../../shared/di/types");
const CreateRoom_dto_1 = require("../../application/dto/CreateRoom.dto");
const UpdateRoom_dto_1 = require("../../application/dto/UpdateRoom.dto");
const FilterRoom_dto_1 = require("../../application/dto/FilterRoom.dto");
const validation_middleware_1 = require("../middleware/validation.middleware");
let RoomController = class RoomController {
    constructor(svc, hotelService) {
        this.svc = svc;
        this.hotelService = hotelService;
        this.storage = multer_1.default.diskStorage({
            destination: "uploads/rooms/",
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = path_1.default.extname(file.originalname);
                cb(null, uniqueSuffix + ext);
            },
        });
        this.upload = (0, multer_1.default)({
            storage: this.storage,
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB
            },
        });
        this.create = [
            this.upload.array("images", 10),
            (0, validation_middleware_1.validationMiddleware)(CreateRoom_dto_1.CreateRoomSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const dto = CreateRoom_dto_1.CreateRoomSchema.parse(req.body);
                    const files = req.files || [];
                    if (files.length)
                        dto.images = files.map((f) => f.path);
                    const room = yield this.svc.createRoom(dto);
                    const hotel = yield this.hotelService.getHotel(room.hotelId);
                    res.status(201).json(Object.assign(Object.assign({}, room), { hotel }));
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.list = [
            (0, validation_middleware_1.validationMiddleware)(FilterRoom_dto_1.FilterRoomSchema, "query"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const filters = FilterRoom_dto_1.FilterRoomSchema.parse(req.query);
                    const { data, total, page, limit } = yield this.svc.listRooms(filters);
                    const enriched = data.map((room) => (Object.assign({}, room)));
                    res.json({ data: enriched, total, page, limit });
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield this.svc.getRoom(req.params.id);
                const hotel = yield this.hotelService.getHotel(room.hotelId);
                res.json(Object.assign(Object.assign({}, room), { hotel }));
            }
            catch (err) {
                next(err);
            }
        });
        this.update = [
            this.upload.array("images", 10),
            (0, validation_middleware_1.validationMiddleware)(UpdateRoom_dto_1.UpdateRoomSchema, "body"),
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const dto = UpdateRoom_dto_1.UpdateRoomSchema.parse(req.body);
                    const files = req.files || [];
                    if (files.length)
                        dto.newImages = files.map((f) => f.path);
                    const updated = yield this.svc.updateRoom(req.params.id, dto);
                    const hotel = yield this.hotelService.getHotel(updated.hotelId);
                    res.json(Object.assign(Object.assign({}, updated), { hotel }));
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.deleteRoom(req.params.id);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
        this.removeImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.removeImage(req.params.id, req.params.imageId);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
        this.removeAmenity = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.svc.removeAmenity(req.params.id, req.params.amenityId);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
    }
};
exports.RoomController = RoomController;
exports.RoomController = RoomController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.RoomService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.HotelService)),
    __metadata("design:paramtypes", [RoomService_1.RoomService,
        HotelService_1.HotelService])
], RoomController);
