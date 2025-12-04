"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomSchema = void 0;
const zod_1 = require("zod");
const CreateRoom_dto_1 = require("./CreateRoom.dto");
const Room_model_1 = require("../../infrastructure/database/models/Room.model");
// Base schema with all fields made optional for updates
exports.UpdateRoomSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid().optional(),
    hotelId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.preprocess((val) => val === 'true' || val === true || val === '1', zod_1.z.boolean().optional()),
    roomName: zod_1.z.string().min(1, { message: "Room name is required" }).optional(),
    pricePerNight: zod_1.z.preprocess((val) => (0, CreateRoom_dto_1.coerceNumber)(val), zod_1.z.number().min(0, { message: "Price must be a positive number" }).optional()),
    rating: zod_1.z.preprocess((val) => (0, CreateRoom_dto_1.coerceNumber)(val), zod_1.z.number().min(0).max(5, { message: "Rating must be between 0 and 5" }).optional()),
    roomType: zod_1.z.string().min(1, { message: "Room type is required" }).optional(),
    room_category: zod_1.z.preprocess((val) => {
        if (!val)
            return undefined;
        return Object.values(Room_model_1.RoomCategory).includes(val)
            ? val
            : undefined;
    }, zod_1.z.nativeEnum(Room_model_1.RoomCategory).optional()),
    max_occupancy: zod_1.z.preprocess((val) => (0, CreateRoom_dto_1.coerceNumber)(val), zod_1.z.number().int().min(1, { message: "Max occupancy must be at least 1" }).optional()),
    single_bed_count: zod_1.z.preprocess((val) => (0, CreateRoom_dto_1.coerceNumber)(val), zod_1.z.number().int().min(0, { message: "Bed count cannot be negative" }).optional()),
    double_bed_count: zod_1.z.preprocess((val) => (0, CreateRoom_dto_1.coerceNumber)(val), zod_1.z.number().int().min(0, { message: "Bed count cannot be negative" }).optional()),
    available_quantity: zod_1.z.preprocess((val) => (0, CreateRoom_dto_1.coerceNumber)(val), zod_1.z.number().int().min(0, { message: "Available quantity cannot be negative" }).optional()),
    availableRooms: zod_1.z.preprocess((val) => (0, CreateRoom_dto_1.coerceNumber)(val), zod_1.z.number().int().min(0, { message: "Available rooms cannot be negative" }).optional()),
    numberOfBeds: zod_1.z.preprocess((val) => (0, CreateRoom_dto_1.coerceNumber)(val), zod_1.z.number().int().min(1, { message: "Number of beds must be at least 1" }).optional()),
    numberOfGuests: zod_1.z.preprocess((val) => (0, CreateRoom_dto_1.coerceNumber)(val), zod_1.z.number().int().min(1, { message: "Number of guests must be at least 1" }).optional()),
    roomSize: zod_1.z.string().min(1, { message: "Room size is required" }).optional(),
    view: zod_1.z.string().min(1, { message: "View description is required" }).optional(),
    floor_type: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    newImages: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string()).optional()),
    imagesToRemove: zod_1.z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), zod_1.z.array(zod_1.z.string()).optional()),
    amenities: zod_1.z.preprocess(CreateRoom_dto_1.parseStringArray, zod_1.z.array(zod_1.z.string()).optional()),
    newAmenities: zod_1.z.preprocess(CreateRoom_dto_1.parseStringArray, zod_1.z.array(zod_1.z.string()).optional()),
}).refine((data) => {
    // Only validate if both fields are present
    if (data.numberOfBeds !== undefined && data.numberOfBeds > 0 &&
        (data.single_bed_count !== undefined || data.double_bed_count !== undefined)) {
        const single = data.single_bed_count || 0;
        const double = data.double_bed_count || 0;
        return (single + double) > 0;
    }
    return true;
}, {
    message: "At least one bed (single or double) must be specified when number of beds is greater than 0",
    path: ["single_bed_count"]
});
